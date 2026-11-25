typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
extern u8 *D_801AB850;
void func_000ecf94(void) {
    s32 pad;
    u8 *o = D_801AB850;
    for ((*(s16 *)((u8 *)(o) + (0x24))) += 10; (*(s16 *)((u8 *)(o) + (0x24))) > 360; (*(s16 *)((u8 *)(o) + (0x24))) -= 360) {
    }
    if (D_801AB850[0x18] & 1) {
        if ((*(s16 *)((u8 *)(D_801AB850) + (0x22))) > 0) {
            (*(s16 *)((u8 *)(D_801AB850) + (0x22)))--;
        }
        if (D_801AB850[0x26] < 0xFF) {
            if (D_801AB850[0x26] + 25 >= 0x100) {
                D_801AB850[0x26] = 0xFF;
            } else {
                D_801AB850[0x26] += 25;
            }
        }
    } else {
        if ((*(s16 *)((u8 *)(D_801AB850) + (0x22))) < 15) {
            (*(s16 *)((u8 *)(D_801AB850) + (0x22)))++;
        }
        if (D_801AB850[0x26] == 0) {
            goto zero;
        }
        if (D_801AB850[0x26] < 26) {
            D_801AB850[0x26] = 0;
        } else {
            D_801AB850[0x26] -= 25;
        }
    }
    if (D_801AB850[0x26] == 0) {
    zero:
        (*(s16 *)((u8 *)(D_801AB850) + (0x24))) = 0;
    }
}
