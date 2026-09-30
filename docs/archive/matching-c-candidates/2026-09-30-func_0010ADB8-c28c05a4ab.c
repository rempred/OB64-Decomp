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

/* Records start one byte after their count and have a ten-byte stride.
 * The case-9 query reads byte +6; its meaning remains uncertain. Two
 * independently observed halfword masks lie at header +0xA2 and +0xA4.
 * The separate original switch-table owner remains production. */
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

                /* Use a word-sized local for each loaded halfword and a
                 * separate narrowed result for its publication. Their
                 * lifetimes retain retail's loop-local constants with the
                 * pinned compiler. Compound assignment shortens the earlier
                 * RTL loop and moves those constants outside it. */
                if (record[1] == 9) {
                    u32 value = *(u16 *)(records + 0xA1);
                    u16 result = value & ~mask;
                    *(u16 *)(records + 0xA1) = result;
                }
                if (record[1] == 14) {
                    u32 value = *(u16 *)(records + 0xA1);
                    u16 result = value & ~mask;
                    *(u16 *)(records + 0xA1) = result;
                }
                if (record[1] == 12) {
                    u32 value = *(u16 *)(records + 0xA1);
                    u16 result = value & ~mask;
                    *(u16 *)(records + 0xA1) = result;
                }
                if (record[1] == 5) {
                    u32 value = *(u16 *)(records + 0xA1);
                    u16 result = value & ~mask;
                    *(u16 *)(records + 0xA1) = result;
                }

                if ((*(u16 *)(records + 0xA1) & mask) == 0) {
                    switch (record[1]) {
                    case 2:
                    case 3:
                        if ((mask & *secondary) == 0) {
                            u32 value = secondary[-1];
                            u16 result = value | mask;
                            secondary[-1] = result;
                        }
                        break;
                    case 9:
                        if (available != 0) {
                            if (record[6] >= available) {
                                u32 value = *primary;
                                u16 result = value | mask;
                                *primary = result;
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
                        if (mask & *secondary) {
                            u32 value = secondary[-1];
                            u16 result = value | mask;
                            secondary[-1] = result;
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
                    if (record[1] != 14) {
                        u32 value = *secondary;
                        u16 result = value & ~mask;
                        *secondary = result;
                    }
                    if (record[1] == 5) {
                        u32 value = *secondary;
                        u16 result = value & ~mask;
                        *secondary = result;
                    }
                }
            }
        }
    }
}
