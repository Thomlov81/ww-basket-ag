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
        };
    },
    computed: {
        contextData() {
            return {
                value: this.params?.value,
                row: this.params?.data,
                isGroup: this.params?.node?.group ?? false,
                isExpanded: this.expanded,
                level: this.params?.node?.level ?? 0,
                childCount: this.params?.node?.childrenAfterGroup?.length ?? 0,
                nodeId: this.params?.node?.id,
            };
        },
    },
    beforeMount() {
        this.expanded = this.params?.node?.expanded ?? false;
        this.params?.node?.addEventListener(
            "expandedChanged",
            this.onExpandedChanged
        );
    },
    mounted() {
        if (this.params?.showDrag) {
            const handle = this.$el?.querySelector(".ww-drag-handle");
            this.params.registerRowDragger(handle || this.$el);
        }
    },
    beforeUnmount() {
        this.params?.node?.removeEventListener(
            "expandedChanged",
            this.onExpandedChanged
        );
    },
    methods: {
        onExpandedChanged() {
            this.expanded = this.params?.node?.expanded ?? false;
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
