#include "common/types.h"

typedef struct BriefingRow {
    u8 pad00[0x48];
    s32 field48;
    s32 field4C;
    u8 pad50[8];
    s32 field58;
    u8 pad5C[0x9C];
} BriefingRow;

typedef struct BriefingScene {
    u8 pad00[0x18];
    void *actors[28];
} BriefingScene;

extern u8 *D_801CE8BC;
extern BriefingScene *D_8022A974;
extern s32 func_0020BFF8(void *row);
extern s32 func_0020C0E8(void *row);
extern void func_002B867C(void *row, s32 rowIndex, s32 mode, s32 field48,
                         s32 field4C, u8 anchor, s16 animation);

s32 func_002B88C8(s16 anchor, s16 animation)
{
    s32 rowIndex = 0;
    s32 anchorOffset = anchor * (s32)sizeof(void *);
    u8 anchorByte = (u8)anchor;
    s32 animationWord = animation;
    s32 rowOffset = 0x1C4;

    do {
        BriefingRow *row = (BriefingRow *)(D_801CE8BC + rowOffset);

        if (row->field48 != 0 && func_0020BFF8(row) == 0 &&
            func_0020C0E8(row) != 0 &&
            *(void **)((u8 *)D_8022A974->actors + anchorOffset) != 0) {
            func_002B867C(row, rowIndex, row->field58 < 4, row->field48,
                          row->field4C, anchorByte, animationWord);
            return 0;
        }
        rowIndex++;
        rowOffset += sizeof(*row);
    } while (rowIndex < 20);

    return 0;
}
