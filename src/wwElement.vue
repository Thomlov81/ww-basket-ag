<template>
  <div class="ww-datagrid" :class="gridClasses" :style="wrapperStyle">
    <ag-grid-vue
      :rowData="rowData"
      :columnDefs="columnDefs"
      :initial-state="initialState"
      :defaultColDef="defaultColDef"
      :domLayout="content.layout === 'auto' ? 'autoHeight' : 'normal'"
      :style="style"
      :rowSelection="rowSelection"
      :selection-column-def="selectionColumnDef"
      :theme="theme"
      :getRowId="getRowId"
      :pagination="content.pagination"
      :paginationPageSize="
        forcedPaginationPageSize
          ? 0
          : paginationPageSizeSelector
          ? paginationPageSizeSelector[0]
          : content.paginationPageSize
      "
      :paginationPageSizeSelector="paginationPageSizeSelector"
      :suppressMovableColumns="!content.movableColumns"
      :columnHoverHighlight="content.columnHoverHighlight"
      :locale-text="localeText"
      enableCellTextSelection
      ensureDomOrder
      :singleClickEdit="content?.singleClickEdit || false"
      :row-drag-managed="true"
      @grid-ready="onGridReady"
      @row-selected="onRowSelected"
      @selection-changed="onSelectionChanged"
      @cell-value-changed="onCellValueChanged"
      @cell-editing-started="onCellEditingStarted"
      @filter-changed="onFilterChanged"
      @sort-changed="onSortChanged"
      @row-clicked="onRowClicked"
      @row-drag-end="onRowDragged"
      @row-drag-enter="onRowDragEnter"
      @column-moved="onColumnMoved"
      @column-resized="onColumnResized"
      @pagination-changed="onPaginationChanged"
    >
    </ag-grid-vue>
    <button
      v-if="content.showSettingsIcon"
      class="ww-datagrid-settings-btn"
      :style="settingsIconButtonStyle"
      @click="onSettingsClicked"
    >
      <div
        class="ww-datagrid-settings-btn__icon"
        v-html="settingsIconHtml"
      ></div>
    </button>
  </div>
</template>

<script>
import {
  shallowRef,
  watchEffect,
  computed,
  inject,
  watch,
  nextTick,
  ref,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import {
  AG_GRID_LOCALE_EN,
  AG_GRID_LOCALE_FR,
  AG_GRID_LOCALE_DE,
  AG_GRID_LOCALE_ES,
  AG_GRID_LOCALE_PT,
} from "@ag-grid-community/locale";
import ActionCellRenderer from "./components/ActionCellRenderer.vue";
import ImageCellRenderer from "./components/ImageCellRenderer.vue";
import WewebCellRenderer from "./components/WewebCellRenderer.vue";
import DragCellRenderer from "./components/DragCellRenderer.vue";

// TODO: maybe register less modules
// TODO: maybe register modules per grid instead of globally
ModuleRegistry.registerModules([AllCommunityModule]);

export default {
  components: {
    AgGridVue,
    ActionCellRenderer,
    ImageCellRenderer,
    WewebCellRenderer,
    DragCellRenderer,
  },
  props: {
    content: {
      type: Object,
      required: true,
    },
    uid: {
      type: String,
      required: true,
    },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ["trigger-event", "update:content:effect"],
  setup(props, ctx) {
    const { resolveMappingFormula } = wwLib.wwFormula.useFormula();
    const { getIcon } = wwLib.useIcons();

    // Default gear SVG fallback for settings icon
    const DEFAULT_SETTINGS_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.295a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.262.125l-1.25-.834a6.953 6.953 0 0 1-1.416.587l-.295 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.262l.834-1.25a6.957 6.957 0 0 1-.587-1.416l-1.473-.295A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.38 3.2l1.25.834a6.957 6.957 0 0 1 1.416-.587l.294-1.473ZM13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clip-rule="evenodd" /></svg>';

    const settingsIconHtml = ref(DEFAULT_SETTINGS_ICON);

    watchEffect(async () => {
      settingsIconHtml.value = props.content?.settingsIconType
        ? (await getIcon(props.content.settingsIconType)) || DEFAULT_SETTINGS_ICON
        : DEFAULT_SETTINGS_ICON;
    });

    const gridApi = shallowRef(null);

    // Fill container mode refs
    const containerHeight = ref(0);
    const initialContainerHeight = ref(0);
    const resizeObserver = ref(null);
    const observedContainer = ref(null);
    const resizeHandler = ref(null);
    const isInternalResize = ref(false);
    const lastExternalHeight = ref(0);

    // Column overrides: shallow ref holding a deep copy of the initial overrides.
    // Using shallowRef so that in-place mutations do NOT trigger columnDefs re-evaluation.
    const columnOverridesForDefs = shallowRef(
      JSON.parse(JSON.stringify(props.content?.columnOverrides || {}))
    );

    // Flag to suppress column state emission until overrides have been applied.
    const columnStateReady = ref(false);

    // Flag to track if initial overrides have been applied (one-time auto-apply).
    const initialOverridesApplied = ref(false);

    // Debounced column state change emission (300ms)
    let columnStateDebounceTimer = null;

    const { value: selectedRows, setValue: setSelectedRows } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: "selectedRows",
        type: "array",
        defaultValue: [],
        readonly: true,
      });
    const { value: filterValue, setValue: setFilters } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: "filters",
        type: "object",
        defaultValue: {},
        readonly: true,
      });
    const { value: sortValue, setValue: setSort } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: "sort",
        type: "object",
        defaultValue: {},
        readonly: true,
      });
    const { value: columnOrder, setValue: setColumnOrder } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: "columnOrder",
        type: "array",
        defaultValue: [],
        readonly: true,
      });

    const { value: data, setValue: setData } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: "data",
        type: "object",
        defaultValue: {
          allData: [],
          total: 0,
          sortedFilteredData: [],
          totalSortedFilteredData: 0,
          perPageTotal: 0,
          totalPages: 0,
          displayedData: [],
          totalDisplayedRecords: 0,
        },
        readonly: true,
      });

    // Helper to get effective hide value based on breakpoint
    const getColumnHide = (col, breakpoint) => {
      const bp = breakpoint || "default";

      // Mobile breakpoint
      if (bp === "mobile") {
        if (col?.hideMobile === "hide") return true;
        if (col?.hideMobile === "show") return false;
        // "inherit" or undefined falls through to default
      }

      // Tablet breakpoint
      if (bp === "tablet") {
        if (col?.hideTablet === "hide") return true;
        if (col?.hideTablet === "show") return false;
        // "inherit" or undefined falls through to default
      }

      // Default breakpoint or inherited
      return col?.hideDefault ?? col?.hide ?? false;
    };

    const debouncedEmitColumnState = (changeType) => {
      if (!columnStateReady.value) return;
      if (columnStateDebounceTimer) {
        clearTimeout(columnStateDebounceTimer);
      }
      columnStateDebounceTimer = setTimeout(() => {
        if (!gridApi.value) return;
        const rawStates = gridApi.value.getColumnState();
        const bp = props.content?.currentBreakpoint || "default";

        const columnsConfig = props.content?.columns || [];
        const configByColId = {};
        const colIdToIndex = {};
        const configByIndex = [];
        columnsConfig.forEach((c, idx) => {
          configByIndex[idx] = c;
          const id = c?.field || c?.actionName;
          if (id) {
            configByColId[id] = c;
            colIdToIndex[id] = idx;
          }
        });

        const existingOverrides = props.content?.columnOverrides || {};

        const buildDefaultStateEntry = (config, configIndex, targetBp) => {
          if (!config) {
            return { order: configIndex, visible: true };
          }
          const configHide = getColumnHide(config, targetBp);
          const isFlexColumn = config?.widthAlgo === "flex";

          const entry = {
            order: configIndex,
            visible: !configHide,
          };

          if (isFlexColumn) {
            entry.flex = config?.flex ?? 1;
          } else {
            entry.width = config?.width ?? null;
          }

          return entry;
        };

        const anyFlexResized = rawStates.some((col) => {
          const config = configByColId[col.colId];
          return config?.widthAlgo === "flex" && col.flex === null;
        });

        const columnStates = {};
        rawStates.forEach((col, index) => {
          // Skip system columns (selection checkbox, drag handle) - not configurable
          if (col.colId === '__dragHandle' || col.colId?.startsWith('ag-Grid-')) return;

          let config = configByColId[col.colId];
          if (!config && index < configByIndex.length) {
            const indexConfig = configByIndex[index];
            if (indexConfig && !indexConfig?.field && !indexConfig?.actionName) {
              config = indexConfig;
            }
          }

          if (config?.allowColumnOverride === false) return;

          const configIndex = colIdToIndex[col.colId] ?? index;
          const isFlexColumn = config?.widthAlgo === "flex";

          const headerName = config?.headerName || col.colId;

          const currentStateEntry = {
            order: index,
            visible: !col.hide,
          };

          if (isFlexColumn) {
            if (anyFlexResized) {
              currentStateEntry.flex = Math.round(col.width);
            } else {
              currentStateEntry.flex = col.flex;
            }
          } else {
            currentStateEntry.width = col.width;
          }

          const existingColOverrides = existingOverrides[col.colId] || {};

          const buildBreakpointState = (targetBp) => {
            if (targetBp === bp) {
              return currentStateEntry;
            }
            if (existingColOverrides[targetBp]) {
              return existingColOverrides[targetBp];
            }
            return buildDefaultStateEntry(config, configIndex, targetBp);
          };

          columnStates[col.colId] = {
            id: col.colId,
            name: headerName,
            default: buildBreakpointState("default"),
            tablet: buildBreakpointState("tablet"),
            mobile: buildBreakpointState("mobile"),
          };
        });

        ctx.emit("trigger-event", {
          name: "onColumnStateChanged",
          event: { changeType, columnStates, breakpoint: bp },
        });
      }, 300);
    };

    // Only emit column state for user-initiated resizes.
    const onColumnResized = (event) => {
      if (!event.finished || event.source !== "uiColumnResized") return;
      debouncedEmitColumnState("resized");
    };

    // Helper to apply column overrides from external state
    const applyColumnOverrides = (colDef, colId, breakpoint) => {
      const overrides = props.content?.columnOverrides?.[colId]?.[breakpoint];
      if (!overrides) return colDef;

      const result = {
        ...colDef,
        hide: overrides.visible === false ? true : overrides.visible === true ? false : colDef.hide,
      };

      if ('flex' in overrides) {
        if (overrides.flex === null) {
          if (colDef.flex != null) {
            result.flex = colDef.flex;
            result.width = null;
          } else {
            result.width = overrides.width ?? colDef.width;
            result.flex = null;
          }
        } else {
          result.width = null;
          result.flex = overrides.flex;
        }
      } else {
        result.width = overrides.width ?? colDef.width;
      }

      return result;
    };

    // Build column state for a specific breakpoint (used for smooth transitions)
    const buildColumnStateForBreakpoint = (breakpoint) => {
      const bp = breakpoint || "default";
      const rawOverrides = props.content?.columnOverrides;
      const overrides = (rawOverrides && typeof rawOverrides === "object") ? rawOverrides : {};
      const columns = props.content?.columns || [];

      const stateArray = columns.map((col, index) => {
        const colId = col?.field || col?.actionName;
        const override = overrides[colId]?.[bp];
        const baseHide = getColumnHide(col, bp);

        const entry = {
          colId,
          hide: override?.visible === false ? true : override?.visible === true ? false : baseHide,
          _order: override?.order ?? index,
        };

        if (override && 'flex' in override) {
          if (override.flex === null) {
            if (col?.widthAlgo === "flex") {
              entry.flex = col?.flex ?? 1;
            } else {
              entry.width = override.width ?? null;
              entry.flex = null;
            }
          } else {
            entry.flex = override.flex;
          }
        } else if (override?.width != null && col?.widthAlgo !== "flex") {
          entry.width = override.width;
        }

        return entry;
      });

      stateArray.sort((a, b) => a._order - b._order);
      return stateArray.map(({ _order, ...state }) => state);
    };

    // Component action: apply the current columnOverrides to the grid.
    const updateColumnOverrides = () => {
      if (!gridApi.value) return;
      const overrides = props.content?.columnOverrides || {};

      // Sync columnOverridesForDefs in place (no .value reassignment)
      const target = columnOverridesForDefs.value;
      for (const key of Object.keys(target)) {
        if (!(key in overrides)) delete target[key];
      }
      for (const key of Object.keys(overrides)) {
        target[key] = JSON.parse(JSON.stringify(overrides[key]));
      }

      const bp = props.content?.currentBreakpoint || "default";
      const columnState = buildColumnStateForBreakpoint(bp);
      gridApi.value.applyColumnState({ state: columnState, applyOrder: true });

      columnStateReady.value = true;
      debouncedEmitColumnState("initialized");
    };

    const onGridReady = (params) => {
      gridApi.value = params.api;
      const columns = params.api.getAllGridColumns();
      setColumnOrder(columns.map((col) => col.getColId()));

      // Enable column state emission now that grid is ready.
      columnStateReady.value = true;

      // Auto-apply column overrides once on initial load.
      const rawOverrides = props.content?.columnOverrides;
      const hasOverrides = rawOverrides && typeof rawOverrides === 'object' && Object.keys(rawOverrides).length > 0;

      if (hasOverrides && !initialOverridesApplied.value) {
        initialOverridesApplied.value = true;
        updateColumnOverrides();
        debouncedEmitColumnState("initialized");
      } else if (!initialOverridesApplied.value) {
        const BINDING_TIMEOUT_MS = 500;
        let timeoutId = null;

        const emitInitialState = () => {
          if (timeoutId) clearTimeout(timeoutId);
          if (!initialOverridesApplied.value) {
            initialOverridesApplied.value = true;
            debouncedEmitColumnState("initialized");
          }
        };

        const stopWatch = watch(
          () => props.content?.columnOverrides,
          (newOverrides) => {
            if (newOverrides && typeof newOverrides === 'object' && Object.keys(newOverrides).length > 0 && !initialOverridesApplied.value) {
              if (timeoutId) clearTimeout(timeoutId);
              initialOverridesApplied.value = true;
              updateColumnOverrides();
              debouncedEmitColumnState("initialized");
              stopWatch();
            }
          },
          { deep: true }
        );

        timeoutId = setTimeout(() => {
          if (!initialOverridesApplied.value) {
            stopWatch();
            emitInitialState();
          }
        }, BINDING_TIMEOUT_MS);
      }
    };

    // Watch for breakpoint changes and apply column state smoothly
    watch(
      () => props.content?.currentBreakpoint,
      (newBp, oldBp) => {
        if (!gridApi.value || newBp === oldBp) return;
        const columnState = buildColumnStateForBreakpoint(newBp);
        gridApi.value.applyColumnState({ state: columnState, applyOrder: true });
      },
      { flush: 'post' }
    );

    let initialFilter = "";
    let initialSort = "";

    watchEffect(() => {
      if (!gridApi.value) return;
      if (
        props.content?.initialFilters &&
        initialFilter !== JSON.stringify(props.content.initialFilters)
      ) {
        gridApi.value.setFilterModel(props.content.initialFilters);
        initialFilter = JSON.stringify(props.content.initialFilters);
      }
      if (
        props.content?.initialSort &&
        initialSort !== JSON.stringify(props.content.initialSort)
      ) {
        gridApi.value.applyColumnState({
          state: props.content.initialSort || [],
          defaultState: { sort: null },
        });
        initialSort = JSON.stringify(props.content.initialSort);
      }
    });

    watchEffect(() => {
      if (!gridApi.value) return;
      if (props.content?.initialColumnsOrder) {
        gridApi.value.applyColumnState({
          state: props.content.initialColumnsOrder.map((colId) => ({ colId })),
          applyOrder: true,
        });
      }
    });

    // Wrapper to not compute variables too often
    let rafId = null;
    const scheduleVariableUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateVariables();
      });
    };

    function updateVariables() {
      if (!gridApi.value) return;

      const dataValue = {
        allData: data.value?.allData,
        total: data.value?.total,
      };

      const sortedFiltered = [];
      gridApi.value.forEachNodeAfterFilterAndSort((node) => {
        sortedFiltered.push(node.data);
      });
      dataValue.sortedFilteredData = sortedFiltered;
      dataValue.totalSortedFilteredData = sortedFiltered.length;

      let displayed = [];
      if (props.content?.pagination) {
        const pageSize = gridApi.value.paginationGetPageSize();
        dataValue.perPageTotal = pageSize;
        dataValue.totalPages = gridApi.value.paginationGetTotalPages();
        const page = gridApi.value.paginationGetCurrentPage();
        const totalDisplayed = gridApi.value.getDisplayedRowCount();
        const start = page * pageSize;
        const end = Math.min(start + pageSize, totalDisplayed);

        for (let i = start; i < end; i++) {
          const node = gridApi.value.getDisplayedRowAtIndex(i);
          displayed.push(node.data);
        }
      } else {
        displayed = sortedFiltered;
      }

      dataValue.displayedData = displayed;
      dataValue.totalDisplayedRecords = displayed.length;

      setData(dataValue);
    }

    const rowData = computed(() => {
      const data = wwLib.wwUtils.getDataFromCollection(props.content?.rowData);
      return Array.isArray(data) ? data ?? [] : [];
    });

    watch(
      rowData,
      (newVal) => {
        const dataValue = { ...data.value };
        dataValue.allData = newVal;
        dataValue.total = newVal.length;
        setData(dataValue);
        scheduleVariableUpdate();
      },
      { immediate: true, deep: true }
    );

    const initialState = computed(() => {
      const state = {
        partialColumnState: true,
      };
      if (props.content?.initialFilters) {
        state.filter = { filterModel: props.content.initialFilters };
      }
      if (props.content?.initialSort) {
        state.sort = { sortModel: props.content.initialSort };
      }
      if (props.content?.initialColumnsOrder) {
        state.columnOrder = {
          orderedColIds: props.content.initialColumnsOrder,
        };
      }
      return state;
    });

    const onRowSelected = (event) => {
      const name = event.node.isSelected() ? "rowSelected" : "rowDeselected";
      ctx.emit("trigger-event", {
        name,
        event: { row: event.data },
      });
    };

    const onRowDragged = (event) => {
      const rows = [];
      event.api.forEachNode((node) => {
        rows.push(node.data);
      });
      ctx.emit("trigger-event", {
        name: "rowDragged",
        event: {
          row: event.node.data,
          id: event.node.id,
          targetIndex: event.overIndex,
          rows,
        },
      });
    };

    const onRowDragEnter = (event) => {
      ctx.emit("trigger-event", {
        name: "rowDragStart",
        event: {
          row: event.node.data,
          id: event.node.id,
        },
      });
    };

    const onSelectionChanged = (event) => {
      if (!gridApi.value) return;
      const selected = gridApi.value.getSelectedRows() || [];
      setSelectedRows(selected);
    };

    const onFilterChanged = (event) => {
      if (!gridApi.value) return;
      const filterModel = gridApi.value.getFilterModel();
      if (
        JSON.stringify(filterModel || {}) !==
        JSON.stringify(filterValue.value || {})
      ) {
        setFilters(filterModel);
        ctx.emit("trigger-event", {
          name: "filterChanged",
          event: filterModel,
        });
        scheduleVariableUpdate();
      }
    };

    const onSortChanged = (event) => {
      if (!gridApi.value) return;
      const state = gridApi.value.getState();
      if (
        JSON.stringify(state.sort?.sortModel || []) !==
        JSON.stringify(sortValue.value || [])
      ) {
        setSort(state.sort?.sortModel || []);
        ctx.emit("trigger-event", {
          name: "sortChanged",
          event: state.sort?.sortModel || [],
        });
        scheduleVariableUpdate();
      }
    };

    const onColumnMoved = (event) => {
      if (!event.finished || event.source !== "uiColumnMoved") return;
      const columns = event.api.getAllGridColumns();
      setColumnOrder(columns.map((col) => col.getColId()));
      ctx.emit("trigger-event", {
        name: "columnMoved",
        event: {
          toIndex: event.toIndex,
          columnId: event.column.getColId(),
          columnsOrder: columns.map((col) => col.getColId()),
        },
      });
      debouncedEmitColumnState("moved");
    };

    const onPaginationChanged = (event) => {
      scheduleVariableUpdate();
    };

    watch(
      () => props.content?.pagination,
      () => {
        scheduleVariableUpdate();
      }
    );

    /* wwEditor:start */
    const { createElement } = wwLib.useCreateElement();
    /* wwEditor:end */

    // Hack to force pagination page size update when changing pagination selector mode
    const forcedPaginationPageSize = ref(false);
    watch(
      () => props.content?.hasPaginationSelector,
      (newVal, oldVal) => {
        if (oldVal === "multiple" && newVal !== "multiple") {
          forcedPaginationPageSize.value = true;
          nextTick().then(() => {
            forcedPaginationPageSize.value = false;
          });
        }
      }
    );

    /* wwEditor:start */
    watch(
      () => [
        props.content?.dynamicHeaderBackgroundColor,
        props.content?.useDynamicStyleHeader,
        props.content?.dynamicHeaderTextColor,
        props.content?.dynamicHeaderFontWeight,
        props.content?.dynamicHeaderFontSize,
        props.content?.dynamicHeaderFontFamily,
      ],
      () => {
        nextTick(() => {
          setTimeout(() => gridApi.value?.refreshHeader(), 100);
        });
      }
    );
    /* wwEditor:end */

    function refreshData() {
      nextTick(() => {
        gridApi.value?.refreshCells();
      });
    }

    return {
      resolveMappingFormula,
      getIcon,
      settingsIconHtml,
      onGridReady,
      onRowSelected,
      onSelectionChanged,
      gridApi,
      onFilterChanged,
      onSortChanged,
      onPaginationChanged,
      localeText: computed(() => {
        switch (props.content?.lang) {
          case "fr":
            return AG_GRID_LOCALE_FR;
          case "de":
            return AG_GRID_LOCALE_DE;
          case "es":
            return AG_GRID_LOCALE_ES;
          case "pt":
            return AG_GRID_LOCALE_PT;
          case "custom":
            return {
              ...AG_GRID_LOCALE_EN,
              ...(props.content?.localeText || {}),
            };
          default:
            return AG_GRID_LOCALE_EN;
        }
      }),
      forcedPaginationPageSize,
      onRowDragged,
      onRowDragEnter,
      onColumnMoved,
      onColumnResized,
      getColumnHide,
      applyColumnOverrides,
      columnOverridesForDefs,
      buildColumnStateForBreakpoint,
      updateColumnOverrides,
      initialState,
      refreshData,
      rowData,
      // Fill container mode
      containerHeight,
      initialContainerHeight,
      resizeObserver,
      observedContainer,
      resizeHandler,
      isInternalResize,
      lastExternalHeight,
      /* wwEditor:start */
      createElement,
      rawContent: inject("componentRawContent", {}),
      /* wwEditor:end */
    };
  },
  mounted() {
    this.setupContainerObserver();
  },
  beforeUnmount() {
    this.cleanupContainerObserver();
  },
  computed: {
    settingsIconButtonStyle() {
      const width = this.content?.settingsIconWidth || "32px";
      return {
        height: (this.headerHeight || 47) + "px",
        width: width,
      };
    },
    gridClasses() {
      return {
        editing: this.isEditing,
        "fill-mode": this.content?.layout === "fill",
        "has-settings-icon": !!this.content?.showSettingsIcon,
      };
    },
    wrapperStyle() {
      return { ...this.cssVars };
    },
    defaultColDef() {
      const definition = {
        editable: false,
        resizable: this.content?.resizableColumns,
        autoHeaderHeight: this.content?.headerHeightMode === "auto",
        wrapHeaderText: this.content?.headerHeightMode === "auto",
        cellClass:
          this.content?.cellAlignmentMode === "custom"
            ? `-${this.content?.cellAlignment || "left"}`
            : null,
      };

      // Cell style for editable/non-editable visual differentiation
      const editableBg = this.content?.editableCellBackgroundColor;
      const nonEditableBg = this.content?.nonEditableCellBackgroundColor;
      const editableCursor = this.content?.editableCellCursor;
      const nonEditableCursor = this.content?.nonEditableCellCursor;

      // Add CSS classes for targeting cells with hover/selection overlays
      if (editableBg || nonEditableBg) {
        const existingCellClass = definition.cellClass;
        definition.cellClass = (params) => {
          if (params.colDef?.colId === "__dragHandle") {
            return existingCellClass
              ? typeof existingCellClass === "function"
                ? existingCellClass(params)
                : existingCellClass
              : null;
          }

          const isEditable =
            typeof params.colDef?.editable === "function"
              ? params.colDef.editable(params)
              : !!params.colDef?.editable;

          const bgClass = isEditable
            ? "ww-cell-editable"
            : "ww-cell-non-editable";

          if (existingCellClass) {
            const existing =
              typeof existingCellClass === "function"
                ? existingCellClass(params)
                : existingCellClass;
            return existing ? [existing, bgClass] : bgClass;
          }
          return bgClass;
        };
      }

      // Inline cellStyle for backgroundColor + cursor (skip drag column)
      if (editableBg || nonEditableBg || editableCursor || nonEditableCursor) {
        definition.cellStyle = (params) => {
          if (params.colDef?.colId === "__dragHandle") return null;
          const isEditable =
            typeof params.colDef?.editable === "function"
              ? params.colDef.editable(params)
              : !!params.colDef?.editable;
          const style = {};
          if (isEditable) {
            if (editableBg) style.backgroundColor = editableBg;
            if (editableCursor) style.cursor = editableCursor;
          } else {
            if (nonEditableBg) style.backgroundColor = nonEditableBg;
            if (nonEditableCursor) style.cursor = nonEditableCursor;
          }
          return Object.keys(style).length > 0 ? style : null;
        };
      }

      if (this.content?.useDynamicStyleHeader) {
        definition.headerStyle = this.getHeaderStyle;
      } else {
        definition.headerStyle = {};
      }
      return definition;
    },
    columnDefs() {
      if (!this.content?.columns) return [];

      // Filter out null/undefined items
      const allItems = this.content.columns.filter((item) => item != null);
      const breakpoint = this.content?.currentBreakpoint || "default";
      const overridesObj =
        this.columnOverridesForDefs &&
        typeof this.columnOverridesForDefs === "object"
          ? this.columnOverridesForDefs
          : {};

      const buildColumnDef = (col) => {
        const effectiveHeaderName = col?.showHeader === false ? '' : col?.headerName;
        const minWidth =
          !col?.minWidth || col?.minWidth === "auto"
            ? null
            : wwLib.wwUtils.getLengthUnit(col?.minWidth)?.[0];
        const maxWidth =
          !col?.maxWidth || col?.maxWidth === "auto"
            ? null
            : wwLib.wwUtils.getLengthUnit(col?.maxWidth)?.[0];
        const width =
          !col?.width || col?.width === "auto" || col?.widthAlgo === "flex"
            ? null
            : wwLib.wwUtils.getLengthUnit(col?.width)?.[0];
        const flex = col?.widthAlgo === "flex" ? col?.flex ?? 1 : null;

        const colId = col?.field || col?.actionName;
        const configHide = this.getColumnHide(col, breakpoint);
        const allowOverride = col?.allowColumnOverride !== false;
        const override = allowOverride ? overridesObj[colId]?.[breakpoint] : undefined;
        const effectiveHide =
          override?.visible === false
            ? true
            : override?.visible === true
              ? false
              : configHide;

        let effectiveWidth;
        let effectiveFlex;

        if (override && 'flex' in override) {
          if (override.flex === null) {
            if (flex != null) {
              effectiveWidth = null;
              effectiveFlex = flex;
            } else {
              effectiveWidth = override.width ?? width;
              effectiveFlex = null;
            }
          } else {
            effectiveWidth = null;
            effectiveFlex = override.flex;
          }
        } else if (override?.width != null) {
          effectiveWidth = flex != null ? null : override.width;
          effectiveFlex = flex;
        } else {
          effectiveWidth = width;
          effectiveFlex = flex;
        }

        const commonProperties = {
          minWidth,
          maxWidth,
          pinned: col?.pinned === "none" ? false : col?.pinned,
          width: effectiveWidth,
          flex: effectiveFlex,
          hide: effectiveHide,
          headerClass: col?.headerAlignment ? `-${col.headerAlignment}` : null,
          ...(this.content?.cellAlignmentMode !== "custom"
            ? { cellClass: col?.cellAlignment ? `-${col.cellAlignment}` : null }
            : {}),
        };

        switch (col?.cellDataType) {
          case "action": {
            return {
              ...commonProperties,
              headerName: effectiveHeaderName,
              cellRenderer: "ActionCellRenderer",
              cellRendererParams: {
                name: col?.actionName,
                label: col?.actionLabel,
                trigger: this.onActionTrigger,
                withFont: !!this.content?.actionFont,
              },
              sortable: false,
              filter: false,
              colId: col?.actionName,
            };
          }
          case "custom":
            return {
              ...commonProperties,
              headerName: effectiveHeaderName,
              field: col?.field,
              cellRenderer: "WewebCellRenderer",
              cellRendererParams: {
                containerId: col?.containerId,
              },
              sortable: col?.sortable,
              filter: col?.filter,
            };
          case "image": {
            return {
              ...commonProperties,
              headerName: effectiveHeaderName,
              field: col?.field,
              cellRenderer: "ImageCellRenderer",
              cellRendererParams: {
                width: col?.imageWidth,
                height: col?.imageHeight,
              },
            };
          }
          default: {
            const result = {
              ...commonProperties,
              headerName: effectiveHeaderName,
              field: col?.field,
              sortable: col?.sortable,
              filter: col?.filter,
              editable: col?.editable,
            };
            if (col?.useCustomLabel) {
              result.valueFormatter = (params) => {
                return this.resolveMappingFormula(
                  col?.displayLabelFormula,
                  params.value
                );
              };
            }
            return result;
          }
        }
      };

      // Sort items by override order before building definitions
      const sortedItems = allItems.map((item, index) => {
        const colId = item?.field || item?.actionName;
        const overrideOrder = overridesObj[colId]?.[breakpoint]?.order;
        return { item, _order: overrideOrder ?? index };
      });
      sortedItems.sort((a, b) => a._order - b._order);

      const result = [];
      for (const { item } of sortedItems) {
        result.push(buildColumnDef(item));
      }

      // Handle row reorder with dedicated drag column
      if (this.content?.rowReorder) {
        const iconSizeRaw = this.content?.dragIconSize || "16px";
        const iconSizePx = parseInt(iconSizeRaw, 10) || 16;
        const paddingRaw = this.content?.dragIconPadding || "4px 8px";
        const paddingParts = paddingRaw.split(/\s+/).map((p) => parseInt(p, 10) || 0);
        const horizontalPadding =
          paddingParts.length >= 4
            ? paddingParts[1] + paddingParts[3]
            : paddingParts.length >= 2
              ? paddingParts[1] * 2
              : paddingParts[0] * 2;
        const dragColWidth = iconSizePx + horizontalPadding + 2;

        result.unshift({
          headerName: "",
          colId: "__dragHandle",
          cellRenderer: "DragCellRenderer",
          cellRendererParams: {
            iconType: this.content?.dragIconType,
            iconSize: iconSizeRaw,
            iconColor: this.content?.dragIconColor,
            iconPadding: paddingRaw,
            iconCursor: this.content?.dragIconCursor || "grab",
            getIcon: this.getIcon,
          },
          width: dragColWidth,
          maxWidth: dragColWidth,
          minWidth: dragColWidth,
          sortable: false,
          filter: false,
          resizable: false,
          suppressMovable: true,
          suppressHeaderMenuButton: true,
          lockPosition: "left",
          cellClass: "ag-drag-handle-cell",
        });
      }

      return result;
    },
    rowSelection() {
      if (this.content?.rowSelection === "multiple") {
        return {
          mode: "multiRow",
          checkboxes: !this.content?.disableCheckboxes,
          headerCheckbox: !this.content?.disableCheckboxes,
          selectAll: this.content?.selectAll || "all",
          enableClickSelection: this.content?.enableClickSelection,
        };
      } else if (this.content?.rowSelection === "single") {
        return {
          mode: "singleRow",
          checkboxes: !this.content?.disableCheckboxes,
          enableClickSelection: this.content?.enableClickSelection,
        };
      } else {
        return {
          mode: "singleRow",
          checkboxes: false,
          isRowSelectable: () => false,
          enableClickSelection: this.content?.enableClickSelection,
        };
      }
    },
    selectionColumnDef() {
      const alignment = this.content?.selectionColumnAlignment;
      return {
        pinned: true,
        width: this.content?.selectionColumnWidth || 56,
        cellClass: alignment ? `-${alignment}` : null,
        headerClass: alignment ? `-${alignment}` : null,
      };
    },
    style() {
      if (this.content?.layout === "auto") return {};
      if (this.content?.layout === "fill") {
        return { height: this.fillContainerHeight || "400px" };
      }
      return {
        height: this.content?.height || "400px",
      };
    },
    fillContainerHeight() {
      if (this.content?.layout !== "fill") return null;

      const rowHeight = this.content?.rowHeight || 42;
      const rowCount = this.workingRowCount;
      const hHeight = this.headerHeight || 47;
      const paginationHeight = this.content?.pagination ? 48 : 0;
      const scrollbarHeight = 17;

      let footerHeight = 0;
      const footerValue = this.content?.footerHeight;
      if (footerValue) {
        footerHeight =
          typeof footerValue === "number"
            ? footerValue
            : parseInt(footerValue, 10) || 0;
      }

      const naturalHeight =
        rowCount * rowHeight +
        hHeight +
        paginationHeight +
        scrollbarHeight +
        2;
      const minHeight = hHeight + rowHeight + scrollbarHeight + 2;

      const availableContainerHeight =
        (this.containerHeight || naturalHeight) - footerHeight;
      const calculatedHeight = Math.min(naturalHeight, availableContainerHeight);
      const finalHeight = Math.max(calculatedHeight, minHeight);

      return `${finalHeight}px`;
    },
    workingRowCount() {
      return this.rowData?.length || 0;
    },
    headerHeight() {
      if (this.content?.headerHeightMode === "auto") {
        return undefined;
      }
      const height = this.content?.headerHeight;
      if (!height) return undefined;
      if (typeof height === "number") return height;
      const parsed = parseInt(height, 10);
      return isNaN(parsed) ? undefined : parsed;
    },
    cssVars() {
      return {
        "--ww-data-grid_action-backgroundColor":
          this.content?.actionBackgroundColor,
        "--ww-data-grid_action-color": this.content?.actionColor,
        "--ww-data-grid_action-padding": this.content?.actionPadding,
        "--ww-data-grid_action-border": this.content?.actionBorder,
        "--ww-data-grid_action-borderRadius": this.content?.actionBorderRadius,
        ...(this.content?.actionFont
          ? { "--ww-data-grid_action-font": this.content.actionFont }
          : {
              "--ww-data-grid_action-fontSize": this.content?.actionFontSize,
              "--ww-data-grid_action-fontFamily": this.content?.actionFontFamily,
              "--ww-data-grid_action-fontWeight": this.content?.actionFontWeight,
              "--ww-data-grid_action-fontStyle": this.content?.actionFontStyle,
              "--ww-data-grid_action-lineHeight": this.content?.actionLineHeight,
            }),
        // Header padding
        "--ww-header-padding": this.content?.headerPadding,
        // Header text color (used as fallback for settings icon color)
        "--ww-header-text-color": this.content?.headerTextColor,
        // Settings icon
        "--ww-settings-icon-color": this.content?.settingsIconColor,
        "--ww-settings-icon-bg": this.content?.settingsIconBg,
        "--ww-settings-icon-size": this.settingsIconButtonStyle?.width,
        // Header column resize divider
        "--ww-header-divider-color": this.content?.headerDividerColor,
        "--ww-header-divider-hover-color": this.content?.headerDividerHoverColor,
        // Cell editing border
        "--ww-cell-editing-border-color": this.content?.cellEditingBorderColor,
        "--ww-cell-editing-border-width": this.content?.cellEditingBorderWidth || "2px",
        "--ww-cell-editing-border-style": this.content?.cellEditingBorderStyle || "solid",
      };
    },
    theme() {
      // Build rowBorder param
      let rowBorderParam = undefined;
      if (this.content?.rowBorderEnabled === false) {
        rowBorderParam = false;
      } else if (
        this.content?.rowBorderColor ||
        this.content?.rowBorderStyle ||
        this.content?.rowBorderWidth
      ) {
        rowBorderParam = {};
        if (this.content?.rowBorderColor)
          rowBorderParam.color = this.content.rowBorderColor;
        if (this.content?.rowBorderStyle)
          rowBorderParam.style = this.content.rowBorderStyle;
        if (this.content?.rowBorderWidth)
          rowBorderParam.width = this.content.rowBorderWidth;
      }

      // Build columnBorder param
      let columnBorderParam = undefined;
      if (this.content?.columnBorderEnabled) {
        columnBorderParam = {};
        if (this.content?.columnBorderColor)
          columnBorderParam.color = this.content.columnBorderColor;
        if (this.content?.columnBorderStyle)
          columnBorderParam.style = this.content.columnBorderStyle;
        if (this.content?.columnBorderWidth)
          columnBorderParam.width = this.content.columnBorderWidth;
      }

      // Build headerColumnBorder param
      let headerColumnBorderParam = undefined;
      if (this.content?.headerColumnBorderEnabled) {
        headerColumnBorderParam = this.content?.headerColumnBorderColor
          ? { color: this.content.headerColumnBorderColor }
          : true;
      }

      return themeQuartz.withParams({
        headerBackgroundColor: this.content?.headerBackgroundColor,
        headerTextColor: this.content?.headerTextColor,
        headerFontSize: this.content?.headerFontSize,
        headerFontFamily: this.content?.headerFontFamily,
        headerFontWeight: this.content?.headerFontWeight,
        headerHeight:
          this.content?.headerHeightMode !== "auto"
            ? this.content?.headerHeight
            : undefined,
        cellHorizontalPadding: this.content?.cellHorizontalPadding,
        borderColor: this.content?.borderColor,
        cellTextColor: this.content?.cellColor,
        cellFontFamily: this.content?.cellFontFamily,
        dataFontSize: this.content?.cellFontSize,
        oddRowBackgroundColor: this.content?.rowAlternateColor,
        backgroundColor: this.content?.rowBackgroundColor,
        rowHoverColor: this.content?.rowHoverColor,
        selectedRowBackgroundColor: this.content?.selectedRowBackgroundColor,
        rowVerticalPaddingScale: this.content?.rowVerticalPaddingScale || 1,
        menuBackgroundColor: this.content?.menuBackgroundColor,
        menuTextColor: this.content?.menuTextColor,
        columnHoverColor: this.content?.columnHoverColor,
        foregroundColor: this.content?.textColor,
        checkboxCheckedBackgroundColor: this.content?.selectionCheckboxColor,
        rangeSelectionBorderColor: this.content?.cellSelectionBorderColor,
        checkboxUncheckedBorderColor:
          this.content?.checkboxUncheckedBorderColor,
        focusShadow: this.content?.focusShadow?.length
          ? this.content.focusShadow
          : "none",
        wrapperBorderRadius: this.content?.wrapperBorderRadius,
        rowBorder: rowBorderParam,
        columnBorder: columnBorderParam,
        headerColumnBorder: headerColumnBorderParam,
        headerColumnBorderHeight: this.content?.headerColumnBorderEnabled
          ? this.content?.headerColumnBorderHeight
          : undefined,
      });
    },
    isEditing() {
      /* wwEditor:start */
      return (
        this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION
      );
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    },
    paginationPageSizeSelector() {
      if (
        !this.content?.pagination ||
        this.content?.hasPaginationSelector !== "multiple"
      ) {
        return false;
      }
      if (
        !Array.isArray(this.content?.paginationPageSizeSelector) ||
        this.content.paginationPageSizeSelector.length === 0
      ) {
        return false;
      }
      return this.content.paginationPageSizeSelector;
    },
  },
  methods: {
    setupContainerObserver() {
      if (this.content?.layout !== "fill") return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this._setupContainerObserverInternal();
        });
      });
    },
    _setupContainerObserverInternal() {
      if (this.content?.layout !== "fill") return;

      let container = null;

      container = this.$el?.closest("[data-datagrid-container]");

      const frontWindow = wwLib.getFrontWindow();
      const frontDocument = wwLib.getFrontDocument();
      if (!container) {
        container = this.$el?.parentElement;

        while (container && container !== frontDocument?.body) {
          const style = frontWindow?.getComputedStyle(container);
          const height = container.clientHeight;

          if (height > 100 && style?.height !== "auto" && style?.height !== "0px") {
            break;
          }
          container = container.parentElement;
        }
      }

      if (!container || container === frontDocument?.body) {
        this.containerHeight = frontWindow?.innerHeight || 600;
        this.initialContainerHeight = this.containerHeight;
        this.lastExternalHeight = this.containerHeight;

        this.resizeHandler = () => {
          const newHeight = frontWindow?.innerHeight || 600;
          this.containerHeight = newHeight;
          this.initialContainerHeight = newHeight;
          this.lastExternalHeight = newHeight;
        };
        frontWindow?.addEventListener("resize", this.resizeHandler);
        return;
      }

      const initialHeight = container.clientHeight;
      this.initialContainerHeight = initialHeight;
      this.containerHeight = initialHeight;
      this.lastExternalHeight = initialHeight;
      this.observedContainer = container;

      let resizeSettleTimer = null;

      this.resizeObserver = new ResizeObserver((entries) => {
        const newHeight =
          entries[0]?.contentRect?.height || container.clientHeight;

        if (this.isInternalResize) {
          return;
        }

        if (resizeSettleTimer) {
          clearTimeout(resizeSettleTimer);
        }

        resizeSettleTimer = setTimeout(() => {
          const settledHeight = container.clientHeight;

          if (settledHeight < 100) {
            return;
          }

          const heightDiff = Math.abs(settledHeight - this.lastExternalHeight);

          if (heightDiff > 10) {
            this.lastExternalHeight = settledHeight;
            this.containerHeight = settledHeight;
            this.initialContainerHeight = settledHeight;
          }
        }, 100);
      });

      this.resizeObserver.observe(container);
    },
    cleanupContainerObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      if (this.resizeHandler) {
        const frontWindow = wwLib.getFrontWindow();
        frontWindow?.removeEventListener("resize", this.resizeHandler);
        this.resizeHandler = null;
      }
      this.observedContainer = null;
      this.containerHeight = 0;
      this.initialContainerHeight = 0;
      this.lastExternalHeight = 0;
      this.isInternalResize = false;
    },
    onSettingsClicked() {
      this.$emit("trigger-event", {
        name: "settingsClicked",
        event: { id: this.uid },
      });
    },
    getRowId(params) {
      return this.resolveMappingFormula(this.content?.idFormula, params.data);
    },
    onActionTrigger(event) {
      this.$emit("trigger-event", {
        name: "action",
        event,
      });
    },
    onCellValueChanged(event) {
      this.$emit("trigger-event", {
        name: "cellValueChanged",
        event: {
          oldValue: event.oldValue,
          newValue: event.newValue,
          columnId: event.column.getColId(),
          row: event.data,
        },
      });
    },
    onCellEditingStarted() {
      if (!this.content?.selectAllOnEditStart) return;
      this.$nextTick(() => {
        setTimeout(() => {
          const input = this.$el?.querySelector(
            ".ag-cell-inline-editing input"
          );
          if (input) {
            input.select();
          }
        }, 10);
      });
    },
    onRowClicked(event) {
      this.$emit("trigger-event", {
        name: "rowClicked",
        event: {
          row: event.data,
          id: event.node.id,
          index: event.node.sourceRowIndex,
          displayIndex: event.rowIndex,
        },
      });
    },
    resetFilters() {
      if (!this.gridApi) return;
      this.gridApi.setFilterModel(null);
    },
    resetSort() {
      if (!this.gridApi) return;
      this.gridApi.applyColumnState({
        state: [],
        defaultState: { sort: null },
      });
    },
    deselectAll() {
      if (!this.gridApi) return;
      this.gridApi.deselectAll();
    },
    selectAll(mode) {
      if (!this.gridApi) return;
      if (this.content?.rowSelection !== "multiple") {
        wwLib.logStore.warning(
          "Select all will have no effect, as row selection is not set to multiple"
        );
        return;
      }
      this.gridApi.selectAll(mode || this.content?.selectAll || "all");
    },
    selectRow(rowId) {
      if (!this.gridApi) return;
      const rowNode = this.gridApi.getRowNode(rowId);
      if (rowNode) {
        rowNode.setSelected(true);
      }
    },
    deselectRow(rowId) {
      if (!this.gridApi) return;
      const rowNode = this.gridApi.getRowNode(rowId);
      if (rowNode) {
        rowNode.setSelected(false);
      }
    },
    getHeaderStyle(params) {
      const colDef = params.column?.getColDef();
      const col = this.content?.columns?.find(
        (c) => c?.field === colDef?.field || (c?.actionName && c.actionName === colDef?.colId)
      );
      const id = params.column?.getColId();
      const context = {
        id,
        name: colDef?.headerName || id,
        dataType: colDef?.cellDataType,
        type: col?.cellDataType === 'dateString' ? 'date' : (col?.cellDataType || 'auto')
      };
      const backgroundColor = this.resolveMappingFormula?.(
        this.content?.dynamicHeaderBackgroundColor,
        context
      );
      const color = this.resolveMappingFormula?.(
        this.content?.dynamicHeaderTextColor,
        context
      );
      const fontWeight = this.resolveMappingFormula?.(
        this.content?.dynamicHeaderFontWeight,
        context
      );
      const fontSize = this.resolveMappingFormula?.(
        this.content?.dynamicHeaderFontSize,
        context
      );
      const fontFamily = this.resolveMappingFormula?.(
        this.content?.dynamicHeaderFontFamily,
        context
      );
      return {
        backgroundColor,
        color,
        fontWeight,
        fontSize,
        fontFamily,
      };
    },
    /* wwEditor:start */
    generateColumns() {
      this.$emit("update:content", {
        columns: this.rowData?.[0]
          ? Object.keys(this.rowData[0]).map((key) => ({
              field: key,
              sortable: true,
              filter: true,
            }))
          : [],
      });
    },
    getOnActionTestEvent() {
      const data = this.rowData;
      if (!data || !data[0]) throw new Error("No data found");
      return {
        actionName: "actionName",
        row: data[0],
        id: 0,
        index: 0,
        displayIndex: 0,
      };
    },
    getOnCellValueChangedTestEvent() {
      const data = this.rowData;
      if (!data || !data[0]) throw new Error("No data found");
      return {
        oldValue: "oldValue",
        newValue: "newValue",
        columnId: "columnId",
        row: data[0],
      };
    },
    getSelectionTestEvent() {
      const data = this.rowData;
      if (!data || !data[0]) throw new Error("No data found");
      return {
        row: data[0],
      };
    },
    getRowClickedTestEvent() {
      const data = this.rowData;
      if (!data || !data[0]) throw new Error("No data found");
      return {
        row: data[0],
        id: 0,
        index: 0,
        displayIndex: 0,
      };
    },
    getRowDraggedTestEvent() {
      const data = this.rowData;
      if (!data || !data[0]) throw new Error("No data found");
      return {
        row: data[0],
        id: 0,
        targetIndex: 1,
        rows: data,
      };
    },
    getRowDragStartTestEvent() {
      const data = this.rowData;
      if (!data || !data[0]) throw new Error("No data found");
      return {
        row: data[0],
        id: 0,
      };
    },
    getColumnMovedTestEvent() {
      const data = this.columnDefs;
      if (!data || !data[0]) throw new Error("No data found");
      return {
        toIndex: 1,
        columnId: data[0].field,
        columnsOrder: data.map((col) => col.field),
      };
    },
    /* wwEditor:end */
  },
  watch: {
    // Watch fill mode height changes to mark internal resizes
    fillContainerHeight: {
      handler(newVal) {
        if (this.content?.layout === "fill" && newVal) {
          this.isInternalResize = true;
          this.$nextTick(() => {
            setTimeout(() => {
              this.isInternalResize = false;
            }, 50);
          });
        }
      },
      immediate: true,
    },
    // Watch for layout mode changes to setup/cleanup fill container observer
    "content.layout": {
      handler(newLayout, oldLayout) {
        if (newLayout === oldLayout) return;

        if (oldLayout === "fill") {
          this.cleanupContainerObserver();
        }

        if (newLayout === "fill") {
          this.$nextTick(() => {
            this.setupContainerObserver();
          });
        }
      },
    },
    /* wwEditor:start */
    columnDefs: {
      async handler() {
        if (this.wwEditorState?.boundProps?.columns) return;
        this.gridApi?.resetColumnState();

        if (this.wwEditorState.isACopy) return;

        // We assume there will only be one custom column each time
        const columnIndex = (this.rawContent.columns || []).findIndex(
          (col) => col?.cellDataType === "custom" && !col?.containerId
        );
        if (columnIndex === -1) return;
        const newColumns = [...this.rawContent.columns];
        let column = { ...newColumns[columnIndex] };
        column.containerId = await this.createElement("ww-flexbox", {
          _state: { name: `Cell ${column.headerName || column.field}` },
        });
        newColumns[columnIndex] = column;
        this.$emit("update:content:effect", { columns: newColumns });
      },
      deep: true,
    },
    /* wwEditor:end */
  },
};
</script>

<style scoped lang="scss">
.ww-datagrid {
  position: relative;
  :deep(.ag-cell-wrapper),
  :deep(.ag-cell-value) {
    height: 100%;
  }
  :deep(.ag-header-cell) {
    padding: var(--ww-header-padding);

    &.-center .ag-header-cell-label {
      justify-content: center;
    }
    &.-right {
      .ag-header-cell-label {
        justify-content: flex-end;
      }
      .ag-header-cell-filter-button {
        margin-left: 4px;
      }
    }
    &.-left .ag-header-cell-label {
      justify-content: flex-start;
    }
  }
  :deep(.ag-cell) {
    .ag-cell-value {
      display: flex;
    }

    &.-right {
      .ag-cell-value {
        justify-content: flex-end;
      }
    }
    &.-center {
      .ag-cell-value {
        justify-content: center;
      }
    }
    &.-left {
      .ag-cell-value {
        justify-content: flex-start;
      }
    }
  }

  // Cell editing border customization
  :deep(.ag-cell-inline-editing) {
    border-color: var(--ww-cell-editing-border-color) !important;
    border-width: var(--ww-cell-editing-border-width, 2px) !important;
    border-style: var(--ww-cell-editing-border-style, solid) !important;

    // Respect cell alignment in edit mode
    &.-center input {
      text-align: center;
    }
    &.-right input {
      text-align: right;
    }
    &.-left input {
      text-align: left;
    }
  }

  // Reserve space in the header for the settings icon
  &.has-settings-icon :deep(.ag-header) {
    padding-right: var(--ww-settings-icon-size, 32px);
  }

  // Fill container mode
  &.fill-mode {
    display: block;
  }

  // Settings icon button
  .ww-datagrid-settings-btn {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ww-settings-icon-bg, transparent);
    color: var(--ww-settings-icon-color, var(--ww-header-text-color, inherit));
    border: none;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.15s;
    box-sizing: border-box;

    &:hover {
      opacity: 1;
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;

      :deep(svg) {
        width: 100%;
        height: 100%;
      }
    }
  }

  // Header column resize divider
  :deep(.ag-header-cell-resize::after) {
    background-color: var(--ww-header-divider-color) !important;
  }
  :deep(.ag-header-cell-resize:hover::after) {
    background-color: var(--ww-header-divider-hover-color, var(--ww-header-divider-color)) !important;
  }

  // Drag handle column
  :deep(.ag-drag-handle-cell) {
    padding: 0 !important;

    .ag-cell-value {
      justify-content: center;
    }
  }

  // Ensure cell content sits above the hover/selection overlay
  :deep(.ww-cell-editable),
  :deep(.ww-cell-non-editable) {
    .ag-cell-wrapper,
    .ag-cell-value {
      position: relative;
      z-index: 1;
    }
  }

  // Hover overlay on cells with editable/non-editable backgrounds
  :deep(.ag-row-hover:not(.ag-full-width-row)) {
    .ww-cell-editable::after,
    .ww-cell-non-editable::after {
      content: "";
      position: absolute;
      inset: 0;
      background-color: var(--ag-row-hover-color);
      pointer-events: none;
    }
  }

  // Selection overlay on cells with editable/non-editable backgrounds
  :deep(.ag-row-selected) {
    .ww-cell-editable::after,
    .ww-cell-non-editable::after {
      content: "";
      position: absolute;
      inset: 0;
      background-color: var(--ag-selected-row-background-color);
      pointer-events: none;
    }
  }

  // Hover + selected: layer both colors (matches AG Grid's own pattern)
  :deep(.ag-row-hover.ag-row-selected) {
    .ww-cell-editable::after,
    .ww-cell-non-editable::after {
      background-color: var(--ag-row-hover-color);
      background-image: linear-gradient(
        var(--ag-selected-row-background-color),
        var(--ag-selected-row-background-color)
      );
    }
  }

  /* wwEditor:start */
  &.editing {
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      display: block;
      pointer-events: initial;
      z-index: 10;
    }
  }
  /* wwEditor:end */
}
</style>
