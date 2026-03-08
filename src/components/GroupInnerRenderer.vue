<template>
    <span v-if="!isGroup" class="group-inner-leaf-icon" :style="iconStyle" v-html="iconHtml"></span>
</template>

<script>
const DEFAULT_LEAF_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>';

export default {
    name: "GroupInnerRenderer",
    props: {
        params: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            iconHtml: DEFAULT_LEAF_ICON,
        };
    },
    computed: {
        isGroup() {
            return !!this.params?.node?.group;
        },
        innerParams() {
            return this.params?.innerRendererParams || {};
        },
        iconStyle() {
            const size = this.innerParams.leafIconSize || "14px";
            return {
                width: size,
                height: size,
                color: this.innerParams.leafIconColor || "#9ca3af",
            };
        },
    },
    async beforeMount() {
        const getIcon = this.innerParams.getIcon;
        const iconType = this.innerParams.leafIconType;
        if (getIcon && iconType) {
            const resolved = await getIcon(iconType);
            if (resolved) {
                this.iconHtml = resolved;
            }
        }
    },
};
</script>

<style scoped>
.group-inner-leaf-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    :deep(svg) {
        width: 100%;
        height: 100%;
    }
}
</style>
