<template>
    <div class="group-cell-wrapper">
        <wwLayoutItemContext
            is-repeat
            :index="params.node.sourceRowIndex"
            :data="contextData"
        >
            <wwElement v-bind="params.containerId" class="group-cell-content"></wwElement>
        </wwLayoutItemContext>
    </div>
</template>

<script>
export default {
    name: "GroupCellRenderer",
    props: {
        params: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            expanded: false,
            currentValue: undefined,
            currentData: null,
            currentIsGroup: false,
            currentLevel: 0,
            currentChildCount: 0,
            currentNodeId: null,
        };
    },
    computed: {
        contextData() {
            return {
                value: this.currentValue,
                row: this.currentData,
                isGroup: this.currentIsGroup,
                isExpanded: this.expanded,
                level: this.currentLevel,
                childCount: this.currentChildCount,
                nodeId: this.currentNodeId,
            };
        },
    },
    beforeMount() {
        this.syncFromParams();
        const node = this.params?.node;
        if (node) {
            node.addEventListener("expandedChanged", this.onExpandedChanged);
            node.addEventListener("allChildrenCountChanged", this.onNodeChanged);
            node.addEventListener("dataChanged", this.onNodeChanged);
            node.addEventListener("uiLevelChanged", this.onNodeChanged);
        }
    },
    mounted() {
        if (this.params?.showDrag) {
            const handle = this.$el?.querySelector(".ww-drag-handle");
            this.params.registerRowDragger(handle || this.$el);
        }
    },
    beforeUnmount() {
        const node = this.params?.node;
        if (node) {
            node.removeEventListener("expandedChanged", this.onExpandedChanged);
            node.removeEventListener("allChildrenCountChanged", this.onNodeChanged);
            node.removeEventListener("dataChanged", this.onNodeChanged);
            node.removeEventListener("uiLevelChanged", this.onNodeChanged);
        }
    },
    methods: {
        syncFromParams() {
            this.expanded = this.params?.node?.expanded ?? false;
            this.currentValue = this.params?.value;
            const data = this.params?.node?.data ?? this.params?.data;
            this.currentData = data ? { ...data } : null;
            this.currentIsGroup = this.params?.node?.group ?? false;
            this.currentLevel = this.params?.node?.level ?? 0;
            this.currentChildCount = this.params?.node?.childrenAfterGroup?.length ?? 0;
            this.currentNodeId = this.params?.node?.id;
        },
        refresh() {
            this.syncFromParams();
            return true;
        },
        onExpandedChanged() {
            this.expanded = this.params?.node?.expanded ?? false;
        },
        onNodeChanged() {
            this.syncFromParams();
        },
    },
};
</script>

<style scoped lang="scss">
.group-cell-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    line-height: normal;
}
:deep(.group-cell-content) {
    height: 100%;
    flex: 1;
}
</style>
