<template>
    <input
        ref="input"
        class="search-cell-editor"
        type="text"
        v-model="searchText"
        @input="onInput"
    />
</template>

<script>
export default {
    name: "SearchCellEditor",
    props: {
        params: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            searchText: "",
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.input?.focus();
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

<style scoped>
.search-cell-editor {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 8px;
    font: inherit;
    background: transparent;
    box-sizing: border-box;
}
</style>
