typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef int s32;
typedef struct RuntimeUnit RuntimeUnit;

extern RuntimeUnit *D_801F0CB0[];
extern u8 D_801E8680;
extern u8 D_801F0E18[];
extern s32 func_0010A128(RuntimeUnit *unit);
extern void func_0010A718(RuntimeUnit *unit);

/* The record stream starts one byte after its count and uses a ten-byte
 * stride. The case-9 query reads byte +6; its meaning is still unknown.
 * The two halfword masks are independently established at +A2 and +A4.
 * This research source does not replace the separate switch-table owner. */
void func_0010ADB8(s32 available)
{
    u8 index = D_801E8680;

    while (index < D_801E8680 + 3) {
        if (index >= 50) break;
        func_0010A128(D_801F0CB0[index]);
        if (D_801F0E18[0] != 0) {
            func_0010A718(D_801F0CB0[index]);
        }
        index++;
    }

    D_801E8680 += 3;
    if (D_801E8680 > 50) {
        u8 count = D_801F0E18[0];
        D_801E8680 = 0;
        if (count != 0) {
            u8 *records = D_801F0E18 + 1;
            u16 *primary = (u16 *)(D_801F0E18 + 0xA2);
            u16 *secondary = (u16 *)(D_801F0E18 + 0xA4);
            s32 eligible = (available != 0) & (available < 7);

            for (index = 0; index < count; index++) {
                u8 *record = records + index * 10;
                u32 mask = 1U << ((record[0] - 1) & 31);

                if (record[1] == 9) *(u16 *)(records + 0xA1) &= ~mask;
                if (record[1] == 14) *(u16 *)(records + 0xA1) &= ~mask;
                if (record[1] == 12) *(u16 *)(records + 0xA1) &= ~mask;
                if (record[1] == 5) *(u16 *)(records + 0xA1) &= ~mask;

                if ((*(u16 *)(records + 0xA1) & mask) == 0) {
                    switch (record[1]) {
                    case 2:
                    case 3:
                        if ((*secondary & mask) == 0) {
                            secondary[-1] |= mask;
                        }
                        break;
                    case 9:
                        if (available != 0) {
                            if (record[6] >= available) {
                                *primary |= mask;
                            }
                        }
                        break;
                    case 14:
                        if (!eligible) break;
                        /* Fall through to the secondary-mask test. */
                    case 1:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 10:
                    case 12:
                    case 13:
                    case 19:
                        if (*secondary & mask) {
                            secondary[-1] |= mask;
                        }
                        break;
                    case 11:
                    case 15:
                    case 16:
                    case 17:
                    case 18:
                    default:
                        break;
                    }
                    if (record[1] != 14) *secondary &= ~mask;
                    if (record[1] == 5) *secondary &= ~mask;
                }
            }
        }
    }
}
