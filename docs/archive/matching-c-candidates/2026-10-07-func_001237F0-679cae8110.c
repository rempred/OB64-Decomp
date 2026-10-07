typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;
typedef struct RuntimeUnit RuntimeUnit;

#define UNIT_FIELD(type, offset) (*(type *)((u8 *)unit + (offset)))

extern u8 D_801F0FDE;
extern u8 D_801F0EBF[][18];
extern u8 D_801F0ECF[][18];
extern u8 D_801F0E80[][18];
extern u8 D_801F0E1A[][10];
extern u8 D_8018F481;
extern u16 D_801951F0;
extern u16 D_80195214;
extern u16 D_80195238;
extern u16 D_801952A4;
extern char D_801EE638[];
extern s32 func_0012E8EC(RuntimeUnit *unit);
extern s32 func_00123458(s32 row, RuntimeUnit *unit);
extern void func_0005c090(s32 index, s32 value);
extern s32 func_0005c110(s32 index);
extern void func_00023940(char *message);

s32 func_001237F0(RuntimeUnit *unit)
{
    s32 code = UNIT_FIELD(u8, 0xBA);
    u8 mode_two;
    s32 ready;
    s32 index;
    s32 fallback;
    u8 *row;
    s32 kind;
    s32 accumulated;
    s32 condition;
    s32 final_condition;
    s32 middle_condition;
    s32 final_mode;

    if (code < 4) return 0;
    if (code >= 20) {
        if (D_801F0FDE < 15) return code - 19;
        return 0;
    }
    if (!(UNIT_FIELD(u32, 0x00) & 0x11)) return 0;
    index = code - 4;
    /* The byte carries the descriptor mode before becoming the mode-two flag. */
    mode_two = D_801F0EBF[index][0];
    mode_two = mode_two == 2;
    ready = 0;
    if (mode_two) {
        if (D_801F0FDE < 15) {
            if (UNIT_FIELD(u32, 0x00) & 0x40) {
                s32 available = 15 - D_801F0FDE;
                ready = available >= func_0012E8EC(unit);
            } else {
                ready = 1;
            }
        }
    }
    fallback = D_801F0ECF[code - 4][0];
    if (fallback == 0) return 0;
    row = D_801F0E80[code];
    kind = D_801F0E1A[row[0] - 1][0];

    if (kind == 14) {
        if (!func_00123458(row[0], unit)) return 0;
        if (D_801951F0 & 2) return row[4];
        if (D_80195214 & 2) return row[5];
        if (D_80195238 & 2) goto return_row_six;
        if (D_801952A4 & 2) return row[7];
    } else if (kind == 20 && D_8018F481 == 0x36) {
        if (!func_0005c110(20)) {
            if (!mode_two || (ready & mode_two)) {
                func_0005c090(21, 0);
                func_0005c090(22, 0);
                func_0005c090(23, 0);
                func_0005c090(24, 0);
                if (code == 4) {
                    func_0005c090(22, 1);
                    func_0005c090(27, 1);
                } else if (code == 8) {
                    func_0005c090(23, 1);
                    func_0005c090(27, 1);
                } else if (code == 6) {
                    func_0005c090(24, 1);
                    func_0005c090(27, 1);
                } else {
                    func_0005c090(21, 1);
                    func_0005c090(27, 0);
                }
                return fallback;
            }
        } else {
            s32 result = 0;
            if (!func_0005c110(25)) return 0;
            if (mode_two && !(ready & mode_two)) return 0;
            if (code == 4 && func_0005c110(21) && func_0005c110(27)) {
                func_0005c090(25, 0);
                func_0005c090(21, 0);
                func_0005c090(22, 1);
                func_0005c090(27, 0);
                goto assign_code_result;
            } else if (code == 8 && func_0005c110(22) && func_0005c110(27)) {
                func_0005c090(25, 0);
                func_0005c090(22, 0);
                func_0005c090(23, 1);
                func_0005c090(27, 0);
                goto assign_code_result;
            } else if (code == 6 && func_0005c110(23) && func_0005c110(27)) {
                func_0005c090(25, 0);
                func_0005c090(23, 0);
                func_0005c090(24, 1);
                func_0005c090(27, 0);
                goto assign_code_result;
            } else if (code == 10 && func_0005c110(24)) {
                if (func_0005c110(27)) {
                    func_0005c090(25, 0);
                    func_0005c090(24, 0);
                    func_0005c090(21, 1);
                    func_0005c090(27, 0);
                    goto assign_code_result;
                }
            }
            goto return_code_result;
assign_code_result:
            result = fallback;
return_code_result:
            return result;
        }
    }

    if (row[1] == 0) {
        condition = row[0];
        if (condition != 0) {
evaluate_final:
            middle_condition = condition;
            {
evaluate_later:
            final_condition = middle_condition;
            {
evaluate_last:
            if (!func_00123458(final_condition, unit)) return 0;
return_fallback:
            final_mode = mode_two;
            {
return_later_fallback:
            if (!final_mode || (ready & final_mode)) return fallback;
            return 0;
            }
            }
            }
        }
        return fallback & -(D_801F0FDE < 15);
    }
    accumulated = func_00123458(row[0], unit);
    if (row[3] == 0) {
        condition = row[2];
        if (condition != 0) {
            if (row[1] == 1) {
                if (!accumulated) goto evaluate_final;
                if (mode_two && !(ready & mode_two)) return 0;
return_row_six:
                return row[6];
            } else if (row[1] == 2) {
                if (!accumulated) goto return_zero;
                goto evaluate_final;
            } else if (row[1] == 3) {
                if (accumulated) goto return_fallback;
                goto evaluate_final;
            }
        } else {
            func_00023940(D_801EE638);
            for (;;) {}
        }
    } else {
        if (row[1] == 2) {
            accumulated &= func_00123458(row[2], unit);
        } else if (row[1] == 3) {
            accumulated |= func_00123458(row[2], unit);
        }
        if (row[5] == 0) {
            middle_condition = row[4];
            if (middle_condition != 0) {
                u8 operation = row[3];
                if (operation == 2) {
                    if (!accumulated) goto return_zero;
                    goto evaluate_later;
                } else if (operation == 3) {
                    final_mode = mode_two;
                    if (accumulated) {
                        goto return_later_fallback;
                    }
                    goto evaluate_later;
                }
                goto return_zero;
            } else {
                func_00023940(D_801EE638);
                for (;;) {}
            }
        } else {
            if (row[3] == 2) {
                accumulated &= func_00123458(row[4], unit);
            } else if (row[3] == 3) {
                accumulated |= func_00123458(row[4], unit);
            }
            final_condition = row[6];
            if (final_condition != 0) {
                u8 operation = row[5];
                if (operation == 2) {
                    if (!accumulated) goto return_zero;
                    goto evaluate_last;
                } else if (operation == 3) {
                    if (accumulated) goto return_fallback;
                    goto evaluate_last;
                }
                goto return_zero;
            } else {
                func_00023940(D_801EE638);
                for (;;) {}
            }
        }
    }
return_zero:
    return 0;
}
