export default {
  editor: {
    label: {
      en: "Datagrid",
    },
    icon: "table",
    customStylePropertiesOrder: [
      {
        label: "General",
        isCollapsible: true,
        properties: [
          "layout",
          "height",
          "footerHeight",
          "textColor",
          "borderColor",
          "wrapperBorderRadius",
        ],
      },
      {
        label: "Settings Icon",
        isCollapsible: true,
        properties: [
          "showSettingsIcon",
          "settingsIconType",
          "settingsIconWidth",
          "settingsIconColor",
          "settingsIconBg",
        ],
      },
      {
        label: "Drag Handle",
        isCollapsible: true,
        properties: [
          "dragIconType",
          "dragIconSize",
          "dragIconColor",
          "dragIconPadding",
          "dragIconCursor",
        ],
      },
      {
        label: "Header",
        isCollapsible: true,
        properties: [
          "headerBackgroundColor",
          "headerTextColor",
          "headerFontWeight",
          "headerFontSize",
          "headerFontFamily",
          "headerHeightMode",
          "headerHeight",
          "headerPadding",
        ],
      },
      {
        label: "Header Dynamic style",
        isCollapsible: true,
        properties: [
          "useDynamicStyleHeader",
          "dynamicHeaderBackgroundColor",
          "dynamicHeaderTextColor",
          "dynamicHeaderFontWeight",
          "dynamicHeaderFontSize",
          "dynamicHeaderFontFamily",
        ],
      },
      {
        label: "Row",
        isCollapsible: true,
        properties: [
          "rowBackgroundColor",
          "rowAlternateColor",
          "rowHoverColor",
          "rowVerticalPaddingScale",
          "rowHeight",
        ],
      },
      {
        label: "Column",
        isCollapsible: true,
        properties: ["columnHoverHighlight", "columnHoverColor"],
      },
      {
        label: "Grid Lines",
        isCollapsible: true,
        properties: [
          "rowBorderEnabled",
          "rowBorderColor",
          "rowBorderStyle",
          "rowBorderWidth",
          "columnBorderEnabled",
          "columnBorderColor",
          "columnBorderStyle",
          "columnBorderWidth",
          "headerColumnBorderEnabled",
          "headerColumnBorderColor",
          "headerColumnBorderHeight",
          "headerDividerColor",
          "headerDividerHoverColor",
        ],
      },
      {
        label: "Cell",
        isCollapsible: true,
        properties: [
          "cellColor",
          "cellFontFamily",
          "cellFontSize",
          "cellSelectionBorderColor",
          "cellHorizontalPadding",
          "cellAlignmentMode",
          "cellAlignment",
        ],
      },
      {
        label: "Cell Editing",
        isCollapsible: true,
        properties: [
          "singleClickEdit",
          "selectAllOnEditStart",
          "editableCellBackgroundColor",
          "nonEditableCellBackgroundColor",
          "editableCellCursor",
          "nonEditableCellCursor",
          "cellEditingBorderColor",
          "cellEditingBorderWidth",
          "cellEditingBorderStyle",
        ],
      },
      {
        label: "Menu",
        isCollapsible: true,
        properties: ["menuTextColor", "menuBackgroundColor"],
      },
      {
        label: "Selection",
        isCollapsible: true,
        properties: [
          "selectedRowBackgroundColor",
          "selectionCheckboxColor",
          "focusShadow",
          "checkboxUncheckedBorderColor",
        ],
      },
      {
        label: "Action",
        isCollapsible: true,
        properties: [
          "actionColor",
          "actionBackgroundColor",
          "actionPadding",
          "actionBorder",
          "actionBorderRadius",
          "actionFont",
          "actionFontSize",
          "actionFontFamily",
          "actionFontWeight",
          "actionFontStyle",
          "actionLineHeight",
        ],
      },
    ],
    customSettingsPropertiesOrder: [
      "rowData",
      "idFormula",
      "generateColumns",
      "columns",
      {
        label: "External Inputs",
        isCollapsible: true,
        properties: [
          "columnOverrides",
          "currentBreakpoint",
        ],
      },
      {
        label: "Pagination",
        isCollapsible: true,
        properties: [
          "pagination",
          "hasPaginationSelector",
          "paginationPageSize",
          "paginationPageSizeSelector",
        ],
      },
      {
        label: "Selection",
        properties: [
          "rowSelection",
          "enableClickSelection",
          "disableCheckboxes",
          "selectAll",
          "selectionColumnWidth",
          "selectionColumnAlignment",
        ],
      },
      "movableColumns",
      "resizableColumns",
      "rowReorder",
      "reorderInfoBox",
      "dragIconType",
      "dragIconSize",
      "dragIconColor",
      "dragIconPadding",
      "dragIconCursor",
      "initialFilters",
      "initialSort",
      "initialColumnsOrder",
      ["lang", "localeText"],
    ],
  },
  triggerEvents: [
    {
      name: "action",
      label: { en: "On Action" },
      event: { actionName: "", row: null, id: 0, index: 0, displayIndex: 0 },
      getTestEvent: "getOnActionTestEvent",
      default: true,
    },
    {
      name: "cellValueChanged",
      label: { en: "On Cell Value Changed" },
      event: {
        oldValue: null,
        newValue: null,
        columnId: "id",
        row: null,
      },
      getTestEvent: "getOnCellValueChangedTestEvent",
    },
    {
      name: "rowSelected",
      label: { en: "On Row Selected" },
      event: {
        row: null,
      },
      getTestEvent: "getSelectionTestEvent",
    },
    {
      name: "rowDeselected",
      label: { en: "On Row Deselected" },
      event: {
        row: null,
      },
      getTestEvent: "getSelectionTestEvent",
    },
    {
      name: "filterChanged",
      label: { en: "On Filter Changed" },
    },
    {
      name: "sortChanged",
      label: { en: "On Sort Changed" },
    },
    {
      name: "rowClicked",
      label: { en: "On Row Clicked" },
      event: {
        row: null,
        id: 0,
        index: 0,
        displayIndex: 0,
      },
      getTestEvent: "getRowClickedTestEvent",
    },
    {
      name: "rowDragStart",
      label: { en: "On Row Drag Start" },
      event: {
        row: null,
        id: 0,
      },
      getTestEvent: "getRowDragStartTestEvent",
    },
    {
      name: "rowDragged",
      label: { en: "On Row Dragged" },
      event: {
        row: null,
        id: 0,
        targetIndex: 0,
        rows: [],
      },
      getTestEvent: "getRowDraggedTestEvent",
    },
    {
      name: "columnMoved",
      label: { en: "On Column Moved" },
      event: {
        columnId: null,
        toIndex: 0,
        columnsOrder: [],
      },
      getTestEvent: "getColumnMovedTestEvent",
    },
    {
      name: "onColumnStateChanged",
      label: { en: "On Column State Changed" },
      event: {
        changeType: "moved",
        columnStates: {
          columnId: {
            default: {
              order: 0,
              visible: true,
              name: "Column Name",
              width: 100,
            },
          },
        },
        breakpoint: "default",
      },
      default: true,
    },
    {
      name: "settingsClicked",
      label: { en: "On Settings Clicked" },
      event: {
        id: "",
      },
    },
  ],
  actions: [
    { label: "Reset filters", action: "resetFilters" },
    { label: "Reset sort", action: "resetSort" },
    {
      label: "Select all",
      action: "selectAll",
      args: [
        {
          name: "mode",
          type: "select",
          options: [
            { value: null, label: "Grid behavior", default: true },
            { value: "all", label: "All rows" },
            { value: "filtered", label: "Filtered rows" },
            { value: "currentPage", label: "Current page rows" },
          ],
          /* wwEditor:start */
          bindingValidation: {
            type: "string",
            enum: ["all", "filtered", "currentPage"],
            tooltip:
              "Select all behavior: 'all' to select all rows, 'filtered' to select filtered rows, 'currentPage' to select current page rows, and null if you want to fallback on the grid behavior",
          },
          /* wwEditor:end */
        },
      ],
    },
    { label: "Deselect all", action: "deselectAll" },
    {
      label: "Select row",
      action: "selectRow",
      args: [
        {
          name: "Row id",
          type: "string",
        },
      ],
    },
    {
      label: "Deselect row",
      action: "deselectRow",
      args: [
        {
          name: "Row id",
          type: "string",
        },
      ],
    },
    {
      label: "Force Datagrid refresh",
      action: "refreshData",
    },
    {
      label: "Apply Column Overrides",
      action: "updateColumnOverrides",
    },
    {
      label: "Stop search editing",
      action: "stopSearchEditing",
    },
  ],
  properties: {
    layout: {
      type: "TextSelect",
      label: "Height Mode",
      options: {
        options: [
          { value: "fixed", label: "Fixed", default: true },
          { value: "auto", label: "Auto" },
          { value: "fill", label: "Fill Container" },
        ],
      },
      bindable: true,
      responsive: true,
      propertyHelp: {
        tooltip:
          "Fixed: set explicit height. Auto: grows with content (caution with large datasets). Fill Container: grows with content but caps at parent container height with internal scrollbar.",
      },
      bindingValidation: {
        type: "string",
        tooltip: "fixed | auto | fill",
      },
    },
    height: {
      label: { en: "Grid Height" },
      type: "Length",
      section: "style",
      options: {
        noRange: true,
      },
      bindable: true,
      classes: true,
      responsive: true,
      states: true,
      defaultValue: "400px",
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip: "Height of the grid (e.g., 400px)",
      },
      hidden: (content) => content.layout === "auto" || content.layout === "fill",
      /* wwEditor:end */
    },
    footerHeight: {
      label: { en: "Footer Height" },
      type: "Length",
      section: "style",
      options: {
        noRange: true,
      },
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      defaultValue: "0px",
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip:
          "Height reserved for footer element outside the grid (e.g., 50px)",
      },
      propertyHelp: {
        tooltip:
          "Space to reserve for a footer element. Only applies in Fill Container mode.",
      },
      hidden: (content) => content.layout !== "fill",
      /* wwEditor:end */
    },
    headerBackgroundColor: {
      type: "Color",
      label: "Background Color",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
    },
    useDynamicStyleHeader: {
      type: "OnOff",
      label: "Use Dynamic Styling",
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      /* wwEditor:start */
      propertyHelp: {
        tooltip:
          "Toggle dynamic per-column header styles computed from formulas.\nPossible values: `true`, `false`",
      },
      /* wwEditor:end */
    },
    dynamicHeaderBackgroundColor: {
      type: "Formula",
      label: "Background Color",
      options: {
        template: {
          name: "Header name",
          id: "Header id",
          type: "auto",
          dataType: "text",
        },
      },
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content.useDynamicStyleHeader,
      /* wwEditor:start */
      propertyHelp: {
        tooltip:
          "Compute a dynamic background color using the column `name`, `id`, `type` or `dataType`.\nExample: `IF(name = 'Total', '#f1f5f9', #bababa)`",
      },
      /* wwEditor:end */
    },
    headerTextColor: {
      type: "Color",
      label: "Text Color",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
    },
    dynamicHeaderTextColor: {
      type: "Formula",
      label: "Text Color",
      options: {
        template: {
          name: "Header name",
          id: "Header id",
          type: "auto",
          dataType: "text",
        },
      },
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content.useDynamicStyleHeader,
      /* wwEditor:start */
      propertyHelp: {
        tooltip:
          "Compute a dynamic text color using the column `name`, `id`, `type` or `dataType`.\nExample: `IF(id = 'status', '#1f2937', #4a4a4a)`",
      },
      /* wwEditor:end */
    },
    headerFontWeight: {
      label: "Font weight",
      type: "TextSelect",
      options: {
        options: [
          { value: null, label: "Default", default: true },
          { value: 100, label: "100 - Thin" },
          { value: 200, label: "200 - Extra Light" },
          { value: 300, label: "300 - Light" },
          { value: 400, label: "400 - Normal" },
          { value: 500, label: "500 - Medium" },
          { value: 600, label: "600 - Semi Bold" },
          { value: 700, label: "700 - Bold" },
          { value: 800, label: "800 - Extra Bold" },
          { value: 900, label: "900 - Black" },
        ],
      },
      responsive: true,
      states: true,
      classes: true,
      bindable: true,
      bindingValidation: {
        markdown: "font-weight",
        type: "string",
        cssSupports: "font-weight",
      },
    },
    dynamicHeaderFontWeight: {
      label: "Font weight",
      type: "Formula",
      options: {
        template: {
          name: "Header name",
          id: "Header id",
          type: "auto",
          dataType: "text",
        },
      },
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content.useDynamicStyleHeader,
      /* wwEditor:start */
      propertyHelp: {
        tooltip:
          "Compute a dynamic font weight using the column `name`, `id`, `type` or `dataType`.\nPossible values: `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`\nExample: `IF(id = 'priority', 700, 400)`",
      },
      /* wwEditor:end */
    },
    headerFontSize: {
      label: "Font Size",
      type: "Length",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 1, max: 100, default: true },
          { value: "em", label: "em", min: 0, max: 10, digits: 3, step: 0.1 },
          { value: "rem", label: "rem", min: 0, max: 10, digits: 3, step: 0.1 },
        ],
        noRange: true,
      },
      responsive: true,
      states: true,
      classes: true,
      bindable: true,
      bindingValidation: {
        markdown: "font-size",
        type: "string",
        cssSupports: "font-size",
      },
    },
    dynamicHeaderFontSize: {
      label: "Font Size",
      type: "Formula",
      options: {
        template: {
          name: "Header name",
          id: "Header id",
          type: "auto",
          dataType: "text",
        },
      },
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content.useDynamicStyleHeader,
      /* wwEditor:start */
      propertyHelp: {
        tooltip:
          "Compute a dynamic font size using the column `name`, `id`, `type` or `dataType`.\nExample: `IF(name = 'Total', '16px', '14px')`",
      },
      /* wwEditor:end */
    },
    textColor: {
      label: "Text Color",
      type: "Color",
      options: { nullable: true },
      bindable: true,
      bindingValidation: {
        markdown: "color",
        type: "string",
        cssSupports: "color",
      },
      responsive: true,
      states: true,
      classes: true,
    },
    headerFontFamily: {
      label: "Font family",
      type: "FontFamily",
      responsive: true,
      states: true,
      classes: true,
      bindable: true,
      bindingValidation: {
        markdown: "font-family",
        type: "string",
        cssSupports: "font-family",
      },
    },
    dynamicHeaderFontFamily: {
      label: "Font family",
      type: "Formula",
      responsive: true,
      states: true,
      classes: true,
      options: {
        template: {
          name: "Header name",
          id: "Header id",
          type: "auto",
          dataType: "text",
        },
      },
      hidden: (content) => !content.useDynamicStyleHeader,
      /* wwEditor:start */
      propertyHelp: {
        tooltip:
          "Compute a dynamic font family using the column `name`, `id`, `type` or `dataType`.\nExample: `IF(type = 'number', 'Inter', 'Georgia')`",
      },
      /* wwEditor:end */
    },
    headerHeightMode: {
      type: "TextSelect",
      options: {
        options: [
          { value: null, label: "Fixed", default: true },
          { value: "auto", label: "Auto" },
        ],
      },
      label: "Height mode",
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
    },
    headerHeight: {
      label: { en: "Height" },
      type: "Length",
      options: {
        noRange: true,
        unitChoices: [
          { value: "px", label: "px", default: true },
          { value: "em", label: "em", digits: 3, step: 0.1 },
          { value: "rem", label: "rem", digits: 3, step: 0.1 },
        ],
      },
      responsive: true,
      states: true,
      classes: true,
      bindable: true,
      hidden: (content) => content.headerHeightMode === "auto",
    },
    headerPadding: {
      label: { en: "Padding" },
      type: "Spacing",
      options: {
        unitChoices: [{ value: "px", label: "px", min: 0, max: 50 }],
      },
      responsive: true,
      states: true,
      classes: true,
      bindable: true,
    },
    borderColor: {
      type: "Color",
      label: "Border Color",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
    },
    cellColor: {
      type: "Color",
      label: "Text Color",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
    },
    cellFontFamily: {
      label: "Font family",
      type: "FontFamily",
      responsive: true,
      states: true,
      classes: true,
      bindable: true,
      bindingValidation: {
        markdown: "font-family",
        type: "string",
        cssSupports: "font-family",
      },
    },
    cellFontSize: {
      type: "Length",
      label: "Font Size",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 1, max: 100, default: true },
          { value: "em", label: "em", min: 0, max: 10, digits: 3, step: 0.1 },
          { value: "rem", label: "rem", min: 0, max: 10, digits: 3, step: 0.1 },
        ],
        noRange: true,
      },
      responsive: true,
      states: true,
      classes: true,
      bindable: true,
      bindingValidation: {
        markdown: "font-size",
        type: "string",
        cssSupports: "font-size",
      },
    },
    cellSelectionBorderColor: {
      type: "Color",
      label: "Selection Border Color",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      bindingValidation: {
        markdown: "color",
        type: "string",
        cssSupports: "color",
      },
    },
    cellHorizontalPadding: {
      label: { en: "Horizontal Padding" },
      type: "Length",
      options: {
        noRange: true,
        unitChoices: [{ value: "px", label: "px", min: 0, max: 50 }],
      },
      responsive: true,
      states: true,
      classes: true,
      bindable: true,
    },
    columnHoverHighlight: {
      type: "OnOff",
      label: "Hover Highlight",
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
    },
    columnHoverColor: {
      type: "Color",
      label: "Hover Color",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      propertyHelp: {
        tooltip: `Should be a semi-transparent color to allow the background color to show through.`,
      },
      hidden: (content) => !content.columnHoverHighlight,
    },
    headerDividerColor: {
      label: { en: "Divider Color" },
      type: "Color",
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
    },
    headerDividerHoverColor: {
      label: { en: "Divider Hover Color" },
      type: "Color",
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
    },
    rowBorderEnabled: {
      label: { en: "Row Border" },
      type: "OnOff",
      defaultValue: true,
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
    },
    rowBorderColor: {
      label: { en: "Row Border Color" },
      type: "Color",
      options: { nullable: true },
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => content?.rowBorderEnabled === false,
    },
    rowBorderStyle: {
      label: { en: "Row Border Style" },
      type: "TextSelect",
      options: {
        options: [
          { value: "solid", label: "Solid" },
          { value: "dashed", label: "Dashed" },
          { value: "dotted", label: "Dotted" },
        ],
      },
      defaultValue: "solid",
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => content?.rowBorderEnabled === false,
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip: "solid | dashed | dotted",
      },
      /* wwEditor:end */
    },
    rowBorderWidth: {
      label: { en: "Row Border Width" },
      type: "Number",
      options: {
        min: 1,
        max: 10,
        step: 1,
      },
      defaultValue: 1,
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => content?.rowBorderEnabled === false,
      /* wwEditor:start */
      bindingValidation: {
        type: "number",
        tooltip: "Border width in pixels (1-10)",
      },
      /* wwEditor:end */
    },
    columnBorderEnabled: {
      label: { en: "Column Border" },
      type: "OnOff",
      defaultValue: false,
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
    },
    columnBorderColor: {
      label: { en: "Column Border Color" },
      type: "Color",
      options: { nullable: true },
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content?.columnBorderEnabled,
    },
    columnBorderStyle: {
      label: { en: "Column Border Style" },
      type: "TextSelect",
      options: {
        options: [
          { value: "solid", label: "Solid" },
          { value: "dashed", label: "Dashed" },
          { value: "dotted", label: "Dotted" },
        ],
      },
      defaultValue: "solid",
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content?.columnBorderEnabled,
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip: "solid | dashed | dotted",
      },
      /* wwEditor:end */
    },
    columnBorderWidth: {
      label: { en: "Column Border Width" },
      type: "Number",
      options: {
        min: 1,
        max: 10,
        step: 1,
      },
      defaultValue: 1,
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content?.columnBorderEnabled,
      /* wwEditor:start */
      bindingValidation: {
        type: "number",
        tooltip: "Border width in pixels (1-10)",
      },
      /* wwEditor:end */
    },
    headerColumnBorderEnabled: {
      label: { en: "Header Column Border" },
      type: "OnOff",
      defaultValue: false,
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
    },
    headerColumnBorderColor: {
      label: { en: "Header Column Border Color" },
      type: "Color",
      options: { nullable: true },
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content?.headerColumnBorderEnabled,
    },
    headerColumnBorderHeight: {
      label: { en: "Header Column Border Height" },
      type: "TextSelect",
      options: {
        options: [
          { value: "100%", label: "Full" },
          { value: "80%", label: "80%" },
          { value: "50%", label: "50%" },
        ],
      },
      defaultValue: "100%",
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content?.headerColumnBorderEnabled,
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip: "100% | 80% | 50%",
      },
      /* wwEditor:end */
    },
    rowBackgroundColor: {
      type: "Color",
      label: "Background Color",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
    },
    rowAlternateColor: {
      type: "Color",
      label: "Alternate Color",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
    },
    rowHoverColor: {
      type: "Color",
      label: "Hover Color",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      propertyHelp: {
        tooltip: `Should be a semi-transparent color to allow the background color to show through.`,
      },
    },
    selectedRowBackgroundColor: {
      type: "Color",
      label: "Selected Background Color",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      propertyHelp: {
        tooltip: `Should be a semi-transparent color to allow the background color to show through.`,
      },
    },
    selectionCheckboxColor: {
      type: "Color",
      label: "Selection Checkboxes Color",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      bindingValidation: {
        markdown: "color",
        type: "string",
        cssSupports: "color",
      },
    },
    checkboxUncheckedBorderColor: {
      type: "Color",
      label: "Checkbox Unchecked Border Color",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      bindingValidation: {
        markdown: "color",
        type: "string",
        cssSupports: "color",
      },
    },
    focusShadow: {
      type: "Shadows",
      label: "Focus Shadow",
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      bindingValidation: {
        markdown: "shadow",
        type: "string",
        cssSupports: "shadow",
      },
    },
    rowVerticalPaddingScale: {
      type: "Number",
      label: "Vertical Padding Scale",
      options: {
        min: 0,
        max: 5,
        step: 0.1,
        default: 1,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
    },
    rowHeight: {
      type: "Number",
      label: "Row Height",
      options: {
        min: 20,
        max: 200,
        step: 1,
      },
      defaultValue: 42,
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: "Height of each row in pixels. Used for Fill Container mode height calculations.",
      },
      bindingValidation: {
        type: "number",
        tooltip: "Row height in pixels (default: 42)",
      },
      /* wwEditor:end */
    },
    menuTextColor: {
      label: "Text color",
      type: "Color",
      options: { nullable: true },
      bindable: true,
      bindingValidation: {
        markdown: "color",
        type: "string",
        cssSupports: "color",
      },
      responsive: true,
      states: true,
      classes: true,
    },
    menuBackgroundColor: {
      label: "Background color",
      type: "Color",
      options: { nullable: true },
      bindable: true,
      bindingValidation: {
        markdown: "background-color",
        type: "string",
        cssSupports: "background-color",
      },
      responsive: true,
      states: true,
      classes: true,
    },
    showSettingsIcon: {
      type: "OnOff",
      label: "Settings Icon",
      defaultValue: false,
      bindable: true,
    },
    settingsIconColor: {
      label: { en: "Icon Color" },
      type: "Color",
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content?.showSettingsIcon,
    },
    settingsIconBg: {
      label: { en: "Icon Background" },
      type: "Color",
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content?.showSettingsIcon,
    },
    settingsIconType: {
      label: { en: "Icon" },
      type: "SystemIcon",
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      defaultValue: null,
      hidden: (content) => !content?.showSettingsIcon,
    },
    settingsIconWidth: {
      label: { en: "Container Width" },
      type: "Length",
      options: {
        unitChoices: [{ value: "px", label: "px", min: 16, max: 80, default: true }],
        noRange: true,
      },
      defaultValue: "32px",
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content?.showSettingsIcon,
    },
    actionColor: {
      label: "Text color",
      type: "Color",
      options: { nullable: true },
      bindable: true,
      bindingValidation: {
        markdown: "color",
        type: "string",
        cssSupports: "color",
      },
      responsive: true,
      states: true,
      classes: true,
    },
    actionBackgroundColor: {
      label: "Background color",
      type: "Color",
      options: { nullable: true },
      bindable: true,
      bindingValidation: {
        markdown: "background-color",
        type: "string",
        cssSupports: "background-color",
      },
      responsive: true,
      states: true,
      classes: true,
    },
    actionPadding: {
      label: "Padding",
      type: "Spacing",
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      bindingValidation: {
        markdown: "padding",
        type: "string",
        cssSupports: "padding",
      },
    },
    actionBorder: {
      label: "Border",
      type: "Border",
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      bindingValidation: {
        markdown: "border",
        type: "string",
        cssSupports: "border",
      },
    },
    actionBorderRadius: {
      label: "Border radius",
      type: "Spacing",
      options: {
        isCorner: true,
        unitChoices: [
          { value: "px", label: "px", min: 0, max: 50, default: true },
          { value: "%", label: "%", min: 0, max: 100, digits: 2, step: 1 },
        ],
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      bindingValidation: {
        markdown: "border-radius",
        type: "string",
        cssSupports: "border-radius",
      },
    },
    actionFont: {
      label: "Typography",
      type: "Typography",
      options: (content, sidepanelContent, boundProperties) => ({
        initialValue: {
          fontSize: content["actionFontSize"],
          fontFamily: content["actionFontFamily"],
          fontWeight: content["actionFontWeight"],
          fontStyle: content["actionFontStyle"],
          lineHeight: content["actionLineHeight"],
        },
        creationDisabled:
          boundProperties["actionFontSize"] ||
          boundProperties["actionFontFamily"] ||
          boundProperties["actionFontWeight"] ||
          boundProperties["actionFontStyle"] ||
          boundProperties["actionLineHeight"],
        creationDisabledMessage:
          "Cannot create typography from bound properties",
      }),
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
    },
    actionFontSize: {
      label: "Size",
      type: "Length",
      options: {
        unitChoices: [
          { value: "px", label: "px", min: 1, max: 100, default: true },
          { value: "em", label: "em", min: 0, max: 10, digits: 3, step: 0.1 },
          { value: "rem", label: "rem", min: 0, max: 10, digits: 3, step: 0.1 },
        ],
        noRange: true,
      },
      responsive: true,
      states: true,
      classes: true,
      bindable: true,
      hidden: (content, _, boundProps) =>
        content["actionFont"] || boundProps["actionFont"],
      bindingValidation: {
        markdown: "font-size",
        type: "string",
        cssSupports: "font-size",
      },
    },
    actionFontFamily: {
      label: "Font family",
      type: "FontFamily",
      responsive: true,
      states: true,
      classes: true,
      bindable: true,
      hidden: (content, _, boundProps) =>
        content["actionFont"] || boundProps["actionFont"],
      bindingValidation: {
        markdown: "font-family",
        type: "string",
        cssSupports: "font-family",
      },
    },
    actionFontWeight: {
      label: "Font weight",
      type: "TextSelect",
      options: {
        options: [
          { value: null, label: "Default", default: true },
          { value: 100, label: "100 - Thin" },
          { value: 200, label: "200 - Extra Light" },
          { value: 300, label: "300 - Light" },
          { value: 400, label: "400 - Normal" },
          { value: 500, label: "500 - Medium" },
          { value: 600, label: "600 - Semi Bold" },
          { value: 700, label: "700 - Bold" },
          { value: 800, label: "800 - Extra Bold" },
          { value: 900, label: "900 - Black" },
        ],
      },
      responsive: true,
      states: true,
      classes: true,
      bindable: true,
      hidden: (content, _, boundProps) =>
        content["actionFont"] || boundProps["actionFont"],
      bindingValidation: {
        markdown: "font-weight",
        type: "string",
        cssSupports: "font-weight",
      },
    },
    actionFontStyle: {
      label: "Font Style",
      type: "TextRadioGroup",
      options: {
        choices: [
          {
            value: null,
            title: "Default",
            icon: "typo-default",
            default: true,
          },
          { value: "italic", title: "Italic", icon: "typo-italic" },
        ],
      },
      responsive: true,
      states: true,
      bindable: true,
      classes: true,
      hidden: (content, _, boundProps) =>
        content["actionFont"] || boundProps["actionFont"],
      bindingValidation: {
        markdown: "font-style",
        type: "string",
        cssSupports: "font-style",
      },
    },
    actionLineHeight: {
      label: "Line height",
      type: "Length",
      options: {
        unitChoices: [
          { value: "normal", label: "auto", default: true },
          { value: "px", label: "px", min: 0, max: 100 },
          { value: "%", label: "%", min: 0, max: 100 },
          { value: "em", label: "em", min: 0, max: 10, digits: 3, step: 0.1 },
          { value: "rem", label: "rem", min: 0, max: 10, digits: 3, step: 0.1 },
          { value: "unset", label: "none" },
        ],
        noRange: true,
      },
      responsive: true,
      states: true,
      classes: true,
      bindable: true,
      hidden: (content, _, boundProps) =>
        content["actionFont"] || boundProps["actionFont"],
      bindingValidation: {
        markdown: "line-height",
        type: "string",
        cssSupports: "line-height",
      },
    },
    rowData: {
      label: { en: "Data" },
      type: "ObjectList",
      options: {
        useSchema: true,
      },
      section: "settings",
      bindable: true,
      defaultValue: [],
      /* wwEditor:start */
      bindingValidation: {
        validations: [
          {
            type: "array",
          },
          {
            type: "object",
          },
        ],
        tooltip:
          "A collection or an array of data: \n\n`myCollection` or `[{}, {}, ...]`",
      },
      /* wwEditor:end */
    },
    cellAlignmentMode: {
      label: "Alignment Mode",
      type: "TextSelect",
      options: {
        options: [
          { value: "inherit", label: "Same as column", default: true },
          { value: "custom", label: "Custom" },
        ],
      },
    },
    cellAlignment: {
      type: "TextRadioGroup",
      label: "Alignment",
      options: {
        choices: [
          {
            value: "left",
            title: "Left",
            icon: "align-left",
            default: true,
          },
          { value: "center", title: "Center", icon: "align-center" },
          { value: "right", title: "Right", icon: "align-right" },
        ],
      },
      responsive: true,
      states: true,
      classes: true,
      bindable: true,
      section: "style",
      bindingValidation: {
        type: "string",
        enum: ["left", "center", "right"],
        tooltip: "Cell alignment: left, center, or right",
      },
      hidden: (content) => content.cellAlignmentMode !== "custom",
    },
    idFormula: {
      type: "Formula",
      label: "Unique Row Id",
      options: (content) => ({
        template: wwLib.wwUtils.getDataFromCollection(content.rowData)?.[0],
      }),
      section: "settings",
      propertyHelp: {
        tooltip:
          "A unique id per row. Very useful for performance optimization.",
      },
    },
    generateColumns: {
      type: "Button",
      options: {
        text: "Generate columns",
        color: "blue",
        action: "generateColumns",
      },
      section: "settings",
      editorOnly: true,
    },
    columns: {
      label: {
        en: "Columns",
      },
      type: "Array",
      options: {
        item: {
          type: "Object",
          options: (
            content,
            sidePanelContent,
            boundProperties,
            wwProps,
            array
          ) => ({
            singleLine: true,
            item: {
              headerName: {
                label: "Header Name",
                type: "Text",
                bindable: true,
              },
              cellDataType: {
                label: "Type",
                type: "TextSelect",
                options: {
                  options: [
                    { value: undefined, label: "Auto", default: true },
                    { value: "text", label: "Text" },
                    { value: "number", label: "Number" },
                    { value: "boolean", label: "Boolean" },
                    { value: "dateString", label: "Date" },
                    { value: "image", label: "Image" },
                    { value: "action", label: "Action" },
                    { value: "custom", label: "Custom" },
                    { value: "search", label: "Search" },
                  ],
                },
              },
              info: {
                type: "InfoBox",
                options: {
                  variant: "warning",
                  content: "To select your custom cell, use the Layout view",
                },
                editorOnly: true,
                hidden: array?.item?.cellDataType !== "custom",
              },
              searchInfo: {
                type: "InfoBox",
                options: {
                  variant: "warning",
                  content: "To select your custom cell component, use the Layout view",
                },
                editorOnly: true,
                hidden: array?.item?.cellDataType !== "search",
              },
              field: {
                label: "Key",
                type: "Text",
                hidden: array?.item?.cellDataType === "action",
              },
              useCustomLabel: {
                label: "Custom display value",
                type: "OnOff",
                hidden:
                  array?.item?.cellDataType === "action" ||
                  array?.item?.cellDataType === "image" ||
                  array?.item?.cellDataType === "custom" ||
                  array?.item?.cellDataType === "search",
              },
              displayLabelFormula: {
                label: "Display value",
                type: "Formula",
                options: {
                  template: _.get(
                    wwLib.wwUtils.getDataFromCollection(content.rowData)?.[0],
                    array?.item?.field
                  ),
                },
                hidden:
                  array?.item?.cellDataType === "action" ||
                  array?.item?.cellDataType === "image" ||
                  !array?.item?.useCustomLabel ||
                  array?.item?.cellDataType === "custom" ||
                  array?.item?.cellDataType === "search",
              },
              widthAlgo: {
                type: "TextRadioGroup",
                options: {
                  choices: [
                    { value: "fixed", label: "Fixed", default: true },
                    { value: "flex", label: "Flex" },
                  ],
                },
              },
              flex: {
                label: "Flex",
                type: "Number",
                options: {
                  min: 1,
                  max: 10,
                  step: 1,
                  noRange: true,
                  defaultValue: 1,
                },
                hidden: array?.item?.widthAlgo !== "flex",
              },
              width: {
                type: "Length",
                options: {
                  noRange: true,
                  unitChoices: [
                    { value: "px", label: "px", min: 0, max: 1300 },
                    { value: "auto", label: "auto" },
                  ],
                },
                hidden: array?.item?.widthAlgo === "flex",
              },
              minWidth: {
                label: "Min Width",
                type: "Length",
                options: {
                  noRange: true,
                  unitChoices: [
                    { value: "px", label: "px", min: 0, max: 1300 },
                    { value: "auto", label: "auto" },
                  ],
                },
              },
              maxWidth: {
                label: "Max Width",
                type: "Length",
                options: {
                  noRange: true,
                  unitChoices: [
                    { value: "px", label: "px", min: 0, max: 1300 },
                    { value: "auto", label: "auto" },
                  ],
                },
              },
              headerAlignment: {
                type: "TextRadioGroup",
                label: "Header Alignment",
                options: {
                  choices: [
                    {
                      value: "left",
                      title: "Left",
                      icon: "align-left",
                      default: true,
                    },
                    { value: "center", title: "Center", icon: "align-center" },
                    { value: "right", title: "Right", icon: "align-right" },
                  ],
                },
                responsive: true,
                states: true,
                classes: true,
                bindable: true,
                section: "style",
                bindingValidation: {
                  type: "string",
                  enum: ["left", "center", "right"],
                  tooltip: "Header alignment: left, center, or right",
                },
              },
              cellAlignment: {
                type: "TextRadioGroup",
                label: "Cell Alignment",
                options: {
                  choices: [
                    {
                      value: "left",
                      title: "Left",
                      icon: "align-left",
                      default: true,
                    },
                    { value: "center", title: "Center", icon: "align-center" },
                    { value: "right", title: "Right", icon: "align-right" },
                  ],
                },
                responsive: true,
                states: true,
                classes: true,
                bindable: true,
                section: "style",
                bindingValidation: {
                  type: "string",
                  enum: ["left", "center", "right"],
                  tooltip: "Cell alignment: left, center, or right",
                },
              },
              pinned: {
                label: "Pinned",
                type: "TextRadioGroup",
                options: {
                  choices: [
                    { value: "none", label: "None", default: true },
                    { value: "left", label: "Left" },
                    { value: "right", label: "Right" },
                  ],
                },
              },
              hideDefault: {
                label: "Hidden: Default",
                type: "OnOff",
                bindable: true,
                defaultValue: false,
                bindingValidation: {
                  type: "boolean",
                  tooltip: "True to hide the column on default (desktop) breakpoint",
                },
              },
              hideTablet: {
                label: "Hidden: Tablet",
                type: "TextRadioGroup",
                options: {
                  choices: [
                    { value: "inherit", label: "Inherit", default: true },
                    { value: "show", label: "Show" },
                    { value: "hide", label: "Hide" },
                  ],
                },
              },
              hideMobile: {
                label: "Hidden: Mobile",
                type: "TextRadioGroup",
                options: {
                  choices: [
                    { value: "inherit", label: "Inherit", default: true },
                    { value: "show", label: "Show" },
                    { value: "hide", label: "Hide" },
                  ],
                },
              },
              allowColumnOverride: {
                label: "Allow Column Override",
                type: "OnOff",
                defaultValue: true,
                /* wwEditor:start */
                propertyHelp: {
                  tooltip: "Allow this column to be overridden by column state management",
                },
                /* wwEditor:end */
              },
              showHeader: {
                label: "Show Header",
                type: "OnOff",
                defaultValue: true,
                /* wwEditor:start */
                propertyHelp: {
                  tooltip: "When disabled, the column header text will be hidden.",
                },
                /* wwEditor:end */
              },
              editable: {
                label: "Editable",
                type: "OnOff",
                hidden:
                  array?.item?.cellDataType === "action" ||
                  array?.item?.cellDataType === "image" ||
                  array?.item?.cellDataType === "custom" ||
                  array?.item?.cellDataType === "search",
                bindable: true,
              },
              filter: {
                label: "Filter",
                type: "OnOff",
                hidden:
                  array?.item?.cellDataType === "action" ||
                  array?.item?.cellDataType === "image",
                bindable: true,
              },
              sortable: {
                label: "Sortable",
                type: "OnOff",
                hidden:
                  array?.item?.cellDataType === "action" ||
                  array?.item?.cellDataType === "image",
                bindable: true,
              },
              actionName: {
                label: "Action Name",
                type: "Text",
                hidden: array?.item?.cellDataType !== "action",
              },
              actionLabel: {
                label: "Action Label",
                type: "Text",
                hidden: array?.item?.cellDataType !== "action",
              },
              imageWidth: {
                label: "Image width",
                type: "Length",
                options: {
                  noRange: true,
                },
                hidden: array?.item?.cellDataType !== "image",
              },
              imageHeight: {
                label: "Image height",
                type: "Length",
                options: {
                  noRange: true,
                },
                hidden: array?.item?.cellDataType !== "image",
              },
              searchIcon: {
                label: "Search Icon",
                type: "TextSelect",
                options: {
                  options: [
                    { value: undefined, label: "Default (magnifying glass)", default: true },
                  ],
                },
                hidden: array?.item?.cellDataType !== "search",
              },
              searchIconColor: {
                label: "Icon Color",
                type: "Color",
                options: { nullable: true },
                defaultValue: "#9CA3AF",
                hidden: array?.item?.cellDataType !== "search",
              },
              searchIconPaddingRight: {
                label: "Icon Right Padding",
                type: "Number",
                options: {
                  min: 0,
                  max: 50,
                  step: 1,
                  noRange: true,
                  defaultValue: 8,
                },
                hidden: array?.item?.cellDataType !== "search",
              },
              searchIconVisibility: {
                label: "Icon Visibility",
                type: "TextSelect",
                options: {
                  options: [
                    { value: "always", label: "Always", default: true },
                    { value: "editing", label: "Editing only" },
                    { value: "hover", label: "Hover" },
                    { value: "hoverAndEditing", label: "Hover + Editing" },
                  ],
                },
                hidden: array?.item?.cellDataType !== "search",
              },
            },
            propertiesOrder: [
              "headerName",
              "field",
              "cellDataType",
              "info",
              "searchInfo",
              "actionName",
              "actionLabel",
              "imageWidth",
              "imageHeight",
              {
                label: "Search Icon",
                isCollapsible: true,
                properties: [
                  "searchIcon",
                  "searchIconColor",
                  "searchIconPaddingRight",
                  "searchIconVisibility",
                ],
              },
              ,
              "useCustomLabel",
              "displayLabelFormula",
              {
                label: "Width",
                isCollapsible: true,
                properties: [
                  "widthAlgo",
                  "flex",
                  "width",
                  "minWidth",
                  "maxWidth",
                ],
              },
              {
                label: "Configuration",
                isCollapsible: true,
                properties: [
                  "pinned",
                  "hideDefault",
                  "hideTablet",
                  "hideMobile",
                  "allowColumnOverride",
                  "showHeader",
                  "editable",
                  "filter",
                  "sortable",
                ],
              },
            ],
          }),
        },
        defaultValue: {
          filter: false,
          sortable: false,
        },
        movable: true,
        expandable: true,
        getItemLabel(item, index) {
          return item?.headerName?.length
            ? item?.headerName
            : item?.field?.length
            ? item?.field
            : `Column ${index + 1}`;
        },
      },
      defaultValue: [],
      section: "settings",
      bindable: true,
    },
    columnOverrides: {
      label: { en: "Column Overrides" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue: "",
      /* wwEditor:start */
      propertyHelp: {
        tooltip: "Bind an object to override column settings per breakpoint. Format: { columnId: { default: { order, width, visible }, tablet: {...}, mobile: {...} } }",
      },
      bindingValidation: {
        type: "object",
        tooltip: "Column state overrides keyed by column ID and breakpoint",
      },
      /* wwEditor:end */
    },
    currentBreakpoint: {
      label: { en: "Current Breakpoint" },
      type: "Text",
      defaultValue: "default",
      section: "settings",
      bindable: true,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: "Current breakpoint from WeWeb (default/tablet/mobile). Used for responsive column visibility.",
      },
      bindingValidation: {
        type: "string",
        tooltip: "Breakpoint name: 'default', 'tablet', or 'mobile'",
      },
      /* wwEditor:end */
    },
    pagination: {
      label: { en: "Pagination" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: "boolean",
        tooltip: "Enable or disable pagination",
      },
      /* wwEditor:end */
    },
    hasPaginationSelector: {
      label: { en: "Rows Per Page" },
      type: "TextSelect",
      section: "settings",
      bindable: true,
      options: {
        options: [
          { value: "single", label: "Single", default: true },
          { value: "multiple", label: "Multiple" },
        ],
      },
      /* wwEditor:start */
      hidden: (content) => !content.pagination,
      bindingValidation: {
        type: "string",
        enum: ["single", "multiple"],
        tooltip: "Type of pagination (single or multiple)",
      },
      /* wwEditor:end */
    },
    paginationPageSize: {
      type: "Number",
      section: "settings",
      bindable: true,
      defaultValue: 10,
      options: {
        noRange: true,
      },
      /* wwEditor:start */
      bindingValidation: {
        type: "number",
        tooltip: "Number of rows to display per page",
      },
      hidden: (content) =>
        !content.pagination || content.hasPaginationSelector === "multiple",
      /* wwEditor:end */
    },
    paginationPageSizeSelector: {
      type: "RawObject",
      section: "settings",
      bindable: true,
      options: {
        placeholder: "[10, 20, 50, 100]",
      },
      /* wwEditor:start */
      bindingValidation: {
        type: "Array",
        tooltip: "Array of number of rows to display per page",
      },
      hidden: (content) =>
        !content.pagination ||
        !content.hasPaginationSelector ||
        content.hasPaginationSelector === "single",
      /* wwEditor:end */
    },
    rowSelection: {
      label: { en: "Row Selection" },
      type: "TextSelect",
      section: "settings",
      bindable: true,
      options: {
        options: [
          { value: "none", label: "None", default: true },
          { value: "single", label: "Single" },
          { value: "multiple", label: "Multiple" },
        ],
      },
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip: "Type of row selection: none or single or multiple",
      },
      /* wwEditor:end */
    },
    enableClickSelection: {
      label: { en: "Enable Click Selection" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: "boolean",
        tooltip: "True to enable row selection on click",
      },
      hidden: (content) =>
        content.rowSelection === "none" || content.rowSelection === undefined,
      /* wwEditor:end */
    },
    disableCheckboxes: {
      label: { en: "Disable Checkboxes" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: "boolean",
        tooltip: "True to disable checkboxes",
      },
      hidden: (content) =>
        content.rowSelection === "none" || content.rowSelection === undefined,
      /* wwEditor:end */
    },
    selectAll: {
      label: { en: "Select All behavior" },
      type: "TextSelect",
      section: "settings",
      bindable: true,
      defaultValue: "all",
      options: {
        options: [
          { value: "all", label: "All", default: true },
          { value: "filtered", label: "Filtered" },
          { value: "currentPage", label: "Current Page" },
        ],
      },
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        enum: ["all", "filtered", "currentPage"],
        tooltip:
          "Select all behavior: 'all' to select all rows, 'filtered' to select filtered rows, 'currentPage' to select current page rows",
      },
      hidden: (content) => content.rowSelection !== "multiple",
      /* wwEditor:end */
    },
    selectionColumnWidth: {
      label: { en: "Selection Column Width" },
      type: "Number",
      section: "settings",
      defaultValue: 56,
      options: {
        min: 20,
        max: 300,
        step: 1,
      },
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: "number",
        tooltip: "Width of the selection column in pixels",
      },
      hidden: (content) =>
        content.rowSelection === "none" ||
        content.rowSelection === undefined ||
        content.disableCheckboxes,
      /* wwEditor:end */
    },
    selectionColumnAlignment: {
      label: { en: "Selection Column Alignment" },
      type: "TextSelect",
      section: "settings",
      defaultValue: "center",
      options: {
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ],
      },
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip: "Alignment of the selection column: left | center | right",
      },
      hidden: (content) =>
        content.rowSelection === "none" ||
        content.rowSelection === undefined ||
        content.disableCheckboxes,
      /* wwEditor:end */
    },
    movableColumns: {
      label: { en: "Movable Columns" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: "boolean",
        tooltip: "Enable or disable movable columns",
      },
      /* wwEditor:end */
    },
    resizableColumns: {
      label: { en: "Resizable Columns" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: "boolean",
        tooltip: "Enable or disable resizable columns",
      },
      /* wwEditor:end */
    },
    initialFilters: {
      label: { en: "Initial Filters" },
      type: "RawObject",
      section: "settings",
      bindable: true,
      defaultValue: null,
      bindingValidation: {
        type: "object",
        tooltip: "An object representing the initial filter model",
      },
    },
    initialSort: {
      label: { en: "Initial Sort" },
      type: "RawObject",
      section: "settings",
      bindable: true,
      defaultValue: null,
      bindingValidation: {
        type: "array",
        tooltip: "An array representing the initial sort model",
      },
    },
    initialColumnsOrder: {
      label: { en: "Initial Columns Order" },
      type: "RawObject",
      section: "settings",
      bindable: true,
      defaultValue: null,
      bindingValidation: {
        type: "array",
        tooltip: "An array representing the id of the initial columns order",
      },
    },
    lang: {
      label: { en: "Language" },
      type: "TextSelect",
      section: "settings",
      bindable: true,
      options: {
        options: [
          { value: "en", label: "English", default: true },
          { value: "fr", label: "French" },
          { value: "es", label: "Spanish" },
          { value: "de", label: "German" },
          { value: "pt", label: "Portuguese" },
          { value: "custom", label: "Custom" },
        ],
      },
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip:
          "Localisation to use. Default is English. Possible values: en, fr, es, de, pt, custom. Use custom to set your own locale texts.",
      },
      /* wwEditor:end */
    },
    localeText: {
      label: { en: "Locale texts" },
      type: "RawObject",
      section: "settings",
      bindable: true,
      defaultValue: {},
      hidden: (content) => content.lang !== "custom",
      /* wwEditor:start */
      bindingValidation: {
        type: "object",
        tooltip:
          'See <a href="https://github.com/ag-grid/ag-grid/blob/latest/community-modules/locale/src/en-US.ts" target="_blank">Aggrid website</a> for the list of texts to localise',
      },
      /* wwEditor:end */
    },
    wrapperBorderRadius: {
      label: { en: "Border Radius" },
      type: "Length",
      options: {
        noRange: true,
      },
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
    },
    rowReorder: {
      label: { en: "Row Reorder" },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: "boolean",
        tooltip: "Enable or disable row reordering",
      },
      /* wwEditor:end */
    },
    reorderInfoBox: {
      type: "InfoBox",
      section: "settings",
      editorOnly: true,
      hidden: (content) => !(content.rowReorder && content.pagination),
      options: {
        variant: "warning",
        icon: "warning",
        title: "Incompatible options",
        content: `Row reordering is not compatible with pagination. Pagination will be disabled`,
      },
    },
    dragIconType: {
      label: { en: "Drag Icon" },
      type: "SystemIcon",
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      defaultValue: null,
      hidden: (content) => !content?.rowReorder,
    },
    dragIconSize: {
      label: { en: "Icon Size" },
      type: "Length",
      options: {
        unitChoices: [{ value: "px", label: "px", min: 8, max: 48, default: true }],
        noRange: true,
      },
      defaultValue: "16px",
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content?.rowReorder,
    },
    dragIconColor: {
      label: { en: "Icon Color" },
      type: "Color",
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content?.rowReorder,
    },
    dragIconPadding: {
      label: { en: "Icon Padding" },
      type: "Length",
      options: {
        unitChoices: [{ value: "px", label: "px", min: 0, max: 32, default: true }],
        noRange: true,
      },
      defaultValue: "4px 8px",
      bindable: true,
      responsive: true,
      states: true,
      classes: true,
      hidden: (content) => !content?.rowReorder,
    },
    dragIconCursor: {
      label: { en: "Cursor" },
      type: "TextSelect",
      section: "settings",
      options: {
        options: [
          { value: "grab", label: "Grab" },
          { value: "move", label: "Move" },
          { value: "pointer", label: "Pointer" },
          { value: "default", label: "Default" },
          { value: "crosshair", label: "Crosshair" },
        ],
      },
      defaultValue: "grab",
      bindable: true,
      hidden: (content) => !content?.rowReorder,
      /* wwEditor:start */
      bindingValidation: {
        type: "string",
        tooltip: "Valid values: grab | move | pointer | default | crosshair",
      },
      /* wwEditor:end */
    },
    // ── Cell Editing ──────────────────────────────────────────────
    singleClickEdit: {
      type: "OnOff",
      label: "Single Click Edit",
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      propertyHelp: {
        tooltip:
          "Enable single-click to start editing cells instead of double-click.",
      },
      bindingValidation: {
        type: "boolean",
        tooltip: "True to enable single-click editing",
      },
      /* wwEditor:end */
    },
    selectAllOnEditStart: {
      type: "OnOff",
      label: "Select All on Edit",
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      propertyHelp: {
        tooltip:
          "Automatically select all text in the input when a cell enters edit mode.",
      },
      bindingValidation: {
        type: "boolean",
        tooltip: "True to auto-select text on edit start",
      },
      /* wwEditor:end */
    },
    editableCellBackgroundColor: {
      type: "Color",
      label: "Editable Cell Background",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      /* wwEditor:start */
      propertyHelp: {
        tooltip:
          "Background color applied to cells that are editable.",
      },
      bindingValidation: {
        markdown: "background-color",
        type: "string",
        cssSupports: "background-color",
      },
      /* wwEditor:end */
    },
    nonEditableCellBackgroundColor: {
      type: "Color",
      label: "Non-Editable Cell Background",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      /* wwEditor:start */
      propertyHelp: {
        tooltip:
          "Background color applied to cells that are not editable.",
      },
      bindingValidation: {
        markdown: "background-color",
        type: "string",
        cssSupports: "background-color",
      },
      /* wwEditor:end */
    },
    editableCellCursor: {
      type: "TextSelect",
      label: "Editable Cell Cursor",
      options: {
        options: [
          { value: "text", label: "Text" },
          { value: "pointer", label: "Pointer" },
          { value: "cell", label: "Cell" },
          { value: "crosshair", label: "Crosshair" },
          { value: "default", label: "Arrow" },
        ],
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: "Mouse cursor shown when hovering over editable cells.",
      },
      bindingValidation: {
        type: "string",
        tooltip: "Valid values: text | pointer | cell | crosshair | default",
      },
      /* wwEditor:end */
    },
    nonEditableCellCursor: {
      type: "TextSelect",
      label: "Non-Editable Cell Cursor",
      options: {
        options: [
          { value: "not-allowed", label: "Not Allowed" },
          { value: "default", label: "Arrow" },
          { value: "text", label: "Text" },
          { value: "pointer", label: "Pointer" },
        ],
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: "Mouse cursor shown when hovering over non-editable cells.",
      },
      bindingValidation: {
        type: "string",
        tooltip: "Valid values: not-allowed | default | text | pointer",
      },
      /* wwEditor:end */
    },
    cellEditingBorderColor: {
      type: "Color",
      label: "Editing Border Color",
      options: {
        nullable: true,
      },
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      /* wwEditor:start */
      propertyHelp: {
        tooltip:
          "Border color applied to cells that are currently in edit mode.",
      },
      bindingValidation: {
        markdown: "color",
        type: "string",
        cssSupports: "color",
      },
      /* wwEditor:end */
    },
    cellEditingBorderWidth: {
      type: "Length",
      label: "Editing Border Width",
      options: {
        unitChoices: [{ value: "px", label: "px", min: 0, max: 10, default: true }],
        noRange: true,
      },
      defaultValue: "2px",
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: "Border width for cells in edit mode.",
      },
      bindingValidation: {
        type: "string",
        tooltip: "Border width (e.g., 2px)",
      },
      /* wwEditor:end */
    },
    cellEditingBorderStyle: {
      type: "TextSelect",
      label: "Editing Border Style",
      options: {
        options: [
          { value: "solid", label: "Solid" },
          { value: "dashed", label: "Dashed" },
          { value: "dotted", label: "Dotted" },
          { value: "double", label: "Double" },
        ],
      },
      defaultValue: "solid",
      responsive: true,
      bindable: true,
      states: true,
      classes: true,
      /* wwEditor:start */
      propertyHelp: {
        tooltip: "Border style for cells in edit mode.",
      },
      bindingValidation: {
        type: "string",
        tooltip: "Valid values: solid | dashed | dotted | double",
      },
      /* wwEditor:end */
    },
  },
};
