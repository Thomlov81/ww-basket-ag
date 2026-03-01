<template>
    <div class="search-cell-editor-wrapper" :class="dropdownAbove ? 'dropdown-above' : 'dropdown-below'">
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

            // Flip dropdown above if not enough space below in viewport
            const rect = this.$el.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            if (spaceBelow < 300) {
                this.dropdownAbove = true;
            }
        });

        // Mark the AG Grid popup wrapper so we can style it transparently
        this.$el.closest('.ag-popup-editor')?.classList.add('search-popup-editor');

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
            return true;
        },
        getPopupPosition() {
            return 'under';
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
    position: absolute;
    left: 0;
    width: 100%;
    overflow: visible;
}
.dropdown-below :deep(.search-editor-flexbox) {
    top: 100%;
}
.dropdown-above :deep(.search-editor-flexbox) {
    bottom: 100%;
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
