<template>
    <div class="calc-cell-editor-wrapper">
        <input
            ref="input"
            class="calc-cell-editor"
            type="text"
            inputmode="text"
            v-model="expr"
        />
        <Teleport :to="teleportTarget" :disabled="!teleportTarget">
            <div
                v-if="showPopup && teleportTarget"
                ref="popup"
                class="calc-popup ag-custom-component-popup"
                :class="{ 'calc-popup-above': popupAbove }"
                :style="popupStyle"
                @mousedown.prevent
            >
                <div class="calc-popup-header" :style="headerStyle">
                    <span class="calc-popup-header-icon" v-html="calcIcon"></span>
                    <span class="calc-popup-header-text">{{ headerText }}</span>
                </div>
                <div class="calc-popup-body">
                    <div
                        v-for="(step, index) in parsed.steps"
                        :key="index"
                        class="calc-row"
                    >
                        <span class="calc-row-op">{{ opSymbol(step.op) }}</span>
                        <span class="calc-row-value">{{ formatNumber(step.value) }}</span>
                    </div>
                    <div class="calc-row calc-row-total" :class="{ 'calc-row-invalid': !parsed.complete }">
                        <span class="calc-row-op"></span>
                        <span class="calc-row-value">{{ totalDisplay }}</span>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script>
const CALC_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25Zm9.47 4.22a.75.75 0 0 1 1.06 1.06l-1.22 1.22 1.22 1.22a.75.75 0 1 1-1.06 1.06l-1.22-1.22-1.22 1.22a.75.75 0 1 1-1.06-1.06l1.22-1.22-1.22-1.22a.75.75 0 0 1 1.06-1.06l1.22 1.22 1.22-1.22ZM5 7.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 5 7.25Zm.75 4.5a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Zm6.5 0a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z" clip-rule="evenodd" /></svg>';

// Safe, left-to-right (no operator precedence) expression evaluator.
// No eval / new Function — pure tokenizing, CSP-safe.
function parseExpression(raw) {
    let s = String(raw ?? "").replace(/\s+/g, "");
    // Normalize alternative operator glyphs to canonical ones.
    s = s.replace(/[xX×·]/g, "*").replace(/÷/g, "/").replace(/,/g, ".");

    const hasOperator = /[+\-*/]/.test(s.replace(/^-/, ""));
    const empty = s.length === 0;
    const fail = (extra = {}) => ({
        valid: false,
        complete: false,
        hasOperator,
        empty,
        steps: [],
        total: null,
        ...extra,
    });

    if (empty) return fail();

    const firstMatch = s.match(/^-?\d+(?:\.\d+)?/);
    if (!firstMatch) return fail();

    let rest = s.slice(firstMatch[0].length);
    let total = parseFloat(firstMatch[0]);
    const steps = [{ op: null, value: total }];
    const opRe = /^([+\-*/])(\d+(?:\.\d+)?)/;

    while (rest.length) {
        const m = rest.match(opRe);
        if (!m) {
            // Dangling operator or junk — incomplete while typing.
            return { valid: false, complete: false, hasOperator: true, empty: false, steps, total };
        }
        const op = m[1];
        const val = parseFloat(m[2]);
        if (op === "+") total += val;
        else if (op === "-") total -= val;
        else if (op === "*") total *= val;
        else {
            if (val === 0) {
                return { valid: false, complete: false, hasOperator: true, empty: false, steps, total: null, divByZero: true };
            }
            total /= val;
        }
        steps.push({ op, value: val });
        rest = rest.slice(m[0].length);
    }

    if (!isFinite(total)) {
        return { valid: false, complete: false, hasOperator: steps.length > 1, empty: false, steps, total: null };
    }

    return {
        valid: true,
        complete: true,
        hasOperator: steps.length > 1,
        empty: false,
        steps,
        total,
    };
}

export default {
    name: "CalculatorCellEditor",
    props: {
        params: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            expr: this.params?.value == null ? "" : String(this.params.value),
            calcIcon: CALC_ICON,
            popupAbove: false,
            cellRect: null,
            teleportTarget: null,
        };
    },
    computed: {
        parsed() {
            return parseExpression(this.expr);
        },
        showPopup() {
            return !!this.parsed?.hasOperator;
        },
        headerText() {
            return this.params?.calcHeaderText || "Kalkulator";
        },
        totalDisplay() {
            const p = this.parsed;
            if (p?.divByZero) return "—";
            if (p?.complete && p?.total != null) return formatNb(p.total);
            return "…";
        },
        popupStyle() {
            const style = {
                "--ww-calc-popup-bg": this.params?.calcPopupBackgroundColor || "#ffffff",
                "--ww-calc-popup-border-color": this.params?.calcPopupBorderColor || "#e5e7eb",
                "--ww-calc-popup-border-radius": this.params?.calcPopupBorderRadius || "8px",
                "--ww-calc-popup-shadow":
                    this.params?.calcPopupShadowEnabled === false
                        ? "none"
                        : "0 8px 24px rgba(0,0,0,0.12)",
                "--ww-calc-header-bg": this.params?.calcHeaderBackgroundColor || "#eef2ff",
                "--ww-calc-header-color": this.params?.calcHeaderTextColor || "#1e293b",
                "--ww-calc-operand-color": this.params?.calcOperandColor || "#374151",
                "--ww-calc-total-color": this.params?.calcTotalColor || "#111827",
                "--ww-calc-font-size": this.params?.calcFontSize || "14px",
                "--ww-calc-total-font-weight": this.params?.calcTotalFontWeight || "600",
                "--ww-calc-row-spacing": this.params?.calcRowSpacing || "6px",
                "--ww-calc-padding": this.params?.calcPadding || "8px 12px",
            };
            if (!this.cellRect) {
                style.visibility = "hidden";
                return style;
            }
            style.position = "fixed";
            style.minWidth = this.params?.calcPopupMinWidth || (this.cellRect.width + "px");
            style.zIndex = "9999";

            // Horizontal alignment relative to the edited cell.
            const align = this.params?.calcPopupAlign || "left";
            const transforms = [];
            if (align === "right") {
                style.left = this.cellRect.right + "px";
                transforms.push("translateX(-100%)");
            } else if (align === "center") {
                style.left = (this.cellRect.left + this.cellRect.width / 2) + "px";
                transforms.push("translateX(-50%)");
            } else {
                style.left = this.cellRect.left + "px";
            }

            if (this.popupAbove) {
                style.top = (this.cellRect.top - 4) + "px";
                transforms.push("translateY(-100%)");
            } else {
                style.top = (this.cellRect.bottom + 4) + "px";
            }
            if (transforms.length) style.transform = transforms.join(" ");
            return style;
        },
        headerStyle() {
            return {};
        },
    },
    async beforeMount() {
        const getIcon = this.params?.getIcon;
        const iconType = this.params?.calcIconType;
        if (getIcon && iconType) {
            const resolved = await getIcon(iconType);
            if (resolved) {
                this.calcIcon = resolved;
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.input?.focus();
            this.$refs.input?.select();

            const cell = this.$el?.closest(".ag-cell");
            if (cell) {
                const frontDoc = wwLib.getFrontDocument();
                if (frontDoc?.body) {
                    this.teleportTarget = frontDoc.body;
                    const rect = cell.getBoundingClientRect();
                    this.cellRect = {
                        top: rect.top,
                        bottom: rect.bottom,
                        left: rect.left,
                        right: rect.right,
                        width: rect.width,
                    };
                }
                const win = wwLib.getFrontWindow();
                const spaceBelow = (win?.innerHeight || 0) - cell.getBoundingClientRect().bottom;
                if (spaceBelow < 260) {
                    this.popupAbove = true;
                }
            }
        });
    },
    methods: {
        formatNumber(value) {
            return formatNb(value);
        },
        opSymbol(op) {
            if (!op) return "";
            if (op === "*") return "x";
            return op;
        },
        // --- AG Grid cell editor interface ---
        getValue() {
            const p = this.parsed;
            if (p?.valid && p?.complete && p?.total != null && isFinite(p.total)) {
                return p.total;
            }
            // Invalid/incomplete expression — keep the original value.
            return this.params?.value;
        },
        isPopup() {
            return false;
        },
        isCancelAfterEnd() {
            return false;
        },
    },
};

// nb-NO formatting (comma decimal, space thousands), always 2 decimals.
let _nbFormatter = null;
function formatNb(value) {
    if (value == null || !isFinite(value)) return "";
    try {
        if (!_nbFormatter) {
            _nbFormatter = new Intl.NumberFormat("nb-NO", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
        return _nbFormatter.format(value);
    } catch (e) {
        return String(value);
    }
}
</script>

<style scoped lang="scss">
.calc-cell-editor-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
}
.calc-cell-editor {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0;
    padding-left: calc(var(--ag-cell-horizontal-padding, 8px) - var(--ww-cell-editing-border-width, 2px));
    font: inherit;
    text-align: inherit;
    background-color: var(--ag-background-color, #fff);
    border-radius: var(--ag-border-radius, 4px);
    box-sizing: border-box;
}
.calc-popup {
    background: var(--ww-calc-popup-bg, #ffffff);
    border: 1px solid var(--ww-calc-popup-border-color, #e5e7eb);
    border-radius: var(--ww-calc-popup-border-radius, 8px);
    box-shadow: var(--ww-calc-popup-shadow, 0 8px 24px rgba(0, 0, 0, 0.12));
    font-family: inherit;
    font-size: var(--ww-calc-font-size, 14px);
    overflow: hidden;
    min-width: 180px;
}
.calc-popup-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--ww-calc-header-bg, #eef2ff);
    color: var(--ww-calc-header-color, #1e293b);
    font-weight: 600;
}
.calc-popup-header-icon {
    display: inline-flex;
    width: 18px;
    height: 18px;

    :deep(svg) {
        width: 100%;
        height: 100%;
    }
}
.calc-popup-body {
    padding: var(--ww-calc-padding, 8px 12px);
    display: flex;
    flex-direction: column;
    gap: var(--ww-calc-row-spacing, 6px);
}
.calc-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    color: var(--ww-calc-operand-color, #374151);
}
.calc-row-op {
    flex: 0 0 auto;
    min-width: 1em;
    text-align: left;
    color: var(--ww-calc-operand-color, #374151);
}
.calc-row-value {
    flex: 1 1 auto;
    text-align: right;
    font-variant-numeric: tabular-nums;
}
.calc-row-total {
    margin-top: 2px;
    padding-top: 8px;
    border-top: 1px solid var(--ww-calc-popup-border-color, #e5e7eb);
    color: var(--ww-calc-total-color, #111827);
    font-weight: var(--ww-calc-total-font-weight, 600);
}
.calc-row-total .calc-row-value {
    color: var(--ww-calc-total-color, #111827);
}
.calc-row-invalid .calc-row-value {
    opacity: 0.5;
}
</style>
