<template>
  <div
    ref="dragHandle"
    class="drag-handle"
    :style="handleStyle"
  >
    <div class="drag-handle__icon" v-html="iconHtml"></div>
  </div>
</template>

<script>
const DEFAULT_DRAG_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><circle cx="5.5" cy="3.5" r="1.5"/><circle cx="10.5" cy="3.5" r="1.5"/><circle cx="5.5" cy="8" r="1.5"/><circle cx="10.5" cy="8" r="1.5"/><circle cx="5.5" cy="12.5" r="1.5"/><circle cx="10.5" cy="12.5" r="1.5"/></svg>';

export default {
  name: "DragCellRenderer",
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      iconHtml: DEFAULT_DRAG_ICON,
    };
  },
  computed: {
    handleStyle() {
      const size = this.params?.iconSize || "16px";
      return {
        "--drag-icon-size": size,
        "--drag-icon-color": this.params?.iconColor || "currentColor",
        "--drag-icon-padding": this.params?.iconPadding || "0px",
        cursor: this.params?.iconCursor || "grab",
      };
    },
  },
  async beforeMount() {
    const getIcon = this.params?.getIcon;
    const iconType = this.params?.iconType;
    if (getIcon && iconType) {
      const resolved = await getIcon(iconType);
      if (resolved) {
        this.iconHtml = resolved;
      }
    }
  },
  mounted() {
    if (this.$refs.dragHandle) {
      this.params.registerRowDragger(this.$refs.dragHandle);
    }
  },
};
</script>

<style scoped lang="scss">
.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--drag-icon-padding);
  color: var(--drag-icon-color);
  box-sizing: border-box;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--drag-icon-size);
    height: var(--drag-icon-size);

    :deep(svg) {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
