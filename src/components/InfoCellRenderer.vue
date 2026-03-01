<template>
    <div class="info-cell-renderer">
        <div class="info-cell-custom">
            <wwLayoutItemContext
                is-repeat
                :index="params.node.sourceRowIndex"
                :data="{ value: params.value, row: params.data }"
            >
                <wwElement v-bind="params.containerId" class="info-cell-flexbox"></wwElement>
            </wwLayoutItemContext>
        </div>
        <div class="info-cell-value">
            <span class="info-cell-value-text">{{ displayValue }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "InfoCellRenderer",
    props: {
        params: {
            type: Object,
            required: true,
        },
    },
    computed: {
        displayValue() {
            const val = this.params?.valueFormatted ?? this.params?.value;
            return val != null ? String(val) : "";
        },
    },
};
</script>

<style scoped lang="scss">
.info-cell-renderer {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    line-height: normal;
    overflow: hidden;
}
.info-cell-custom {
    flex: none;
    min-height: 0;
    display: flex;
    flex-direction: column;
}
:deep(.info-cell-flexbox) {
    flex: 1;
    min-height: 0;
}
.info-cell-value {
    flex: 1;
    display: flex;
    align-items: center;
    min-height: 0;
}
.info-cell-value-text {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
