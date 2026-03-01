<template>
    <div class="search-cell-editor-wrapper">
        <input
            ref="input"
            class="search-cell-editor"
            type="text"
            v-model="searchText"
            :style="inputStyle"
            @input="onInput"
        />
        <div
            v-if="showIcon"
            class="search-cell-icon"
            :style="iconStyle"
            v-html="iconHtml"
        ></div>
        <Teleport :to="teleportTarget" :disabled="!teleportTarget">
            <div
                ref="dropdown"
                class="search-editor-dropdown ag-custom-component-popup"
                :style="dropdownStyle"
                @mousedown.prevent
            >
                <wwLayoutItemContext
                    is-repeat
                    :index="params.node.sourceRowIndex"
                    :data="{
                        value: params.value,
                        row: params.data,
                        searchOpen: true,
                        searchText: searchText,
                        searchEditingCell: searchState.editingCell,
                    }"
                >
                    <wwElement v-bind="params.containerId" class="search-editor-flexbox ag-custom-component-popup"></wwElement>
                </wwLayoutItemContext>
            </div>
        </Teleport>
    </div>
</template>

<script>
const DEFAULT_SEARCH_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd" /></svg>';

export default {
    name: "SearchCellEditor",
    inject: {
        searchState: {
            default: () => ({ open: false, text: "", editingCell: null }),
        },
    },
    props: {
        params: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            searchText: this.params?.value ?? "",
            iconHtml: DEFAULT_SEARCH_ICON,
            dropdownAbove: false,
            cellRect: null,
            teleportTarget: null,
        };
    },
    computed: {
        showIcon() {
            const v = this.params?.searchIconVisibility || "always";
            return v === "always" || v === "editing" || v === "hoverAndEditing";
        },
        iconStyle() {
            return {
                color: this.params?.searchIconColor || "#9CA3AF",
                right: (this.params?.searchIconPaddingRight ?? 8) + "px",
            };
        },
        inputStyle() {
            const paddingRight = this.params?.searchIconPaddingRight ?? 8;
            return {
                paddingRight: (paddingRight + 16) + "px",
            };
        },
        dropdownStyle() {
            if (!this.cellRect) return { display: 'none' };
            const style = {
                position: 'absolute',
                left: this.cellRect.left + 'px',
                zIndex: '9999',
            };
            if (this.dropdownAbove) {
                style.top = (this.cellRect.top - 4) + 'px';
                style.transform = 'translateY(-100%)';
            } else {
                style.top = (this.cellRect.bottom + 4) + 'px';
            }
            return style;
        },
    },
    async beforeMount() {
        const getIcon = this.params?.getIcon;
        const iconType = this.params?.searchIconType;
        if (getIcon && iconType) {
            const resolved = await getIcon(iconType);
            if (resolved) {
                this.iconHtml = resolved;
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.input?.focus();
            this.$refs.input?.select();

            const cell = this.$el.closest('.ag-cell');
            if (cell) {
                // Teleport to .ww-datagrid — outside AG Grid's overflow containers
                // but inside the Weweb preview area so wwElement renders correctly
                const gridEl = cell.closest('.ww-datagrid');
                if (gridEl) {
                    this.teleportTarget = gridEl;
                    const gridRect = gridEl.getBoundingClientRect();
                    const cellRect = cell.getBoundingClientRect();
                    this.cellRect = {
                        top: cellRect.top - gridRect.top,
                        bottom: cellRect.bottom - gridRect.top,
                        left: cellRect.left - gridRect.left,
                    };
                }

                const spaceBelow = window.innerHeight - cell.getBoundingClientRect().bottom;
                if (spaceBelow < 150) {
                    this.dropdownAbove = true;
                }
            }
        });

        this.params.onSearchEditingStarted?.({
            rowIndex: this.params.node.sourceRowIndex,
            rowId: this.params.node.id,
            colId: this.params.column.getColId(),
            currentValue: this.params.value,
            rowData: this.params.data,
        });
    },
    beforeUnmount() {
        this.params.onSearchEditingStopped?.();
    },
    methods: {
        onInput() {
            this.params.onSearchTextChanged?.(this.searchText);
        },
        getValue() {
            return this.params.value;
        },
        isPopup() {
            return false;
        },
        isCancelAfterEnd() {
            return true;
        },
    },
};
</script>

<style scoped lang="scss">
.search-cell-editor-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
}
.search-cell-editor {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0;
    padding-left: calc(var(--ag-cell-horizontal-padding, 8px) - var(--ww-cell-editing-border-width, 2px));
    font: inherit;
    background-color: var(--ag-background-color, #fff);
    border-radius: var(--ag-border-radius, 4px);
    box-sizing: border-box;
}
:deep(.search-editor-flexbox) {
    overflow: visible;
}
.search-cell-icon {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    pointer-events: none;

    :deep(svg) {
        width: 100%;
        height: 100%;
    }
}
</style>
