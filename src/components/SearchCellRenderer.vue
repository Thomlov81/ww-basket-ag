<template>
    <div class="search-cell-renderer" :class="visibilityClass">
        <div class="search-cell-content">
            <wwLayoutItemContext
                is-repeat
                :index="params.node.sourceRowIndex"
                :data="{
                    value: params.value,
                    row: params.data,
                    searchOpen: searchState.open,
                    searchText: searchState.text,
                    searchEditingCell: searchState.editingCell,
                }"
            >
                <wwElement v-bind="params.containerId" class="search-cell-flexbox"></wwElement>
            </wwLayoutItemContext>
        </div>
        <div
            class="search-cell-icon"
            :style="iconStyle"
            v-html="iconHtml"
        ></div>
    </div>
</template>

<script>
const DEFAULT_SEARCH_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd" /></svg>';

export default {
    name: "SearchCellRenderer",
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
            iconHtml: DEFAULT_SEARCH_ICON,
        };
    },
    computed: {
        iconStyle() {
            return {
                color: this.params?.searchIconColor || "#9CA3AF",
                right: (this.params?.searchIconPaddingRight ?? 8) + "px",
            };
        },
        visibilityClass() {
            const v = this.params?.searchIconVisibility || "always";
            return `search-icon-${v}`;
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
};
</script>

<style scoped lang="scss">
.search-cell-renderer {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
    line-height: normal;
}
.search-cell-content {
    flex: 1;
    height: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
}
:deep(.search-cell-flexbox) {
    height: 100%;
    flex: 1;
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

/* Visibility modes */
.search-icon-always .search-cell-icon {
    opacity: 1;
}
.search-icon-editing .search-cell-icon {
    opacity: 0;
}
.search-icon-hover .search-cell-icon {
    opacity: 0;
}
.search-icon-hover:hover .search-cell-icon {
    opacity: 1;
}
.search-icon-hoverAndEditing .search-cell-icon {
    opacity: 0;
}
.search-icon-hoverAndEditing:hover .search-cell-icon {
    opacity: 1;
}
</style>
