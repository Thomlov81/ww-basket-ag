<template>
    <span v-if="!isGroup" class="group-inner-leaf-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M4 2v8h1V4.5L12.5 12H5v1h9v-1h-1.5L5 4.5V3h8V2H4z" />
        </svg>
    </span>
</template>

<script>
export default {
    name: "GroupInnerRenderer",
    props: {
        params: {
            type: Object,
            required: true,
        },
    },
    computed: {
        isGroup() {
            return !!this.params?.node?.group;
        },
    },
};
</script>

<style scoped>
.group-inner-leaf-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    color: #9ca3af;
}
</style>
