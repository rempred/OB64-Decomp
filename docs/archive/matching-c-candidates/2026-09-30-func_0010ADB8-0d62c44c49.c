typedef unsigned char u8;
typedef unsigned short u16;
typedef int s32;
typedef struct RuntimeUnit RuntimeUnit;

/* Local layout view: observed count at +0, record bytes at +1, and masks
 * at +0xA2/+0xA4. The array describes bytes before the masks; it does not
 * establish a runtime count check or the resource ID domain. */
typedef struct RecordTable {
    u8 count;
    u8 records[16][10];
    u16 primary;
    u16 secondary;
} RecordTable;

extern RuntimeUnit *D_801F0CB0[];
extern u8 D_801E8680;
extern RecordTable D_801F0E18;
extern s32 func_0010A128(RuntimeUnit *unit);
extern void func_0010A718(RuntimeUnit *unit);

void func_0010ADB8(s32 available)
{
    u8 index = D_801E8680;

    while (index < D_801E8680 + 3) {
        if (index >= 50) break;
        func_0010A128(D_801F0CB0[index]);
        if (D_801F0E18.count != 0) {
            func_0010A718(D_801F0CB0[index]);
        }
        index++;
    }

    D_801E8680 += 3;
    if (D_801E8680 > 50) {
        D_801E8680 = 0;
        if (D_801F0E18.count != 0) {
            for (index = 0; index < D_801F0E18.count; index++) {
                u8 *record = D_801F0E18.records[index];
                /* Retail derives the mask from an unchecked loaded ID.
                 * This expression follows its C shift form; ID zero or an
                 * excessive shift has no defined C behavior. Static layout
                 * and a byte match do not establish the resource domain. */
                u16 mask = 1U << (record[0] - 1);

                if (record[1] == 9) D_801F0E18.primary &= ~mask;
                if (record[1] == 14) D_801F0E18.primary &= ~mask;
                if (record[1] == 12) D_801F0E18.primary &= ~mask;
                if (record[1] == 5) D_801F0E18.primary &= ~mask;

                if ((D_801F0E18.primary & mask) == 0) {
                    switch (record[1]) {
                    case 2:
                    case 3:
                        if ((D_801F0E18.secondary & mask) == 0) {
                            D_801F0E18.primary |= mask;
                        }
                        break;
                    case 9:
                        if (available != 0) {
                            if (record[6] >= available) {
                                D_801F0E18.primary |= mask;
                            }
                        }
                        break;
                    case 14:
                        /* Keep this positive gate and its own mask test.
                         * The pinned compiler gives the saved mask its
                         * retail allocation before merging the common tail. */
                        if ((available != 0) & (available < 7)) {
                            if (D_801F0E18.secondary & mask) {
                                D_801F0E18.primary |= mask;
                            }
                        }
                        break;
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
                        if (D_801F0E18.secondary & mask) {
                            D_801F0E18.primary |= mask;
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
                    if (record[1] != 14) D_801F0E18.secondary &= ~mask;
                    if (record[1] == 5) D_801F0E18.secondary &= ~mask;
                }
            }
        }
    }
}
