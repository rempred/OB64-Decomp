#include "game/story_event_entry.h"
typedef struct {
    u16 year;
    u8 month;
    u8 day;
} Date420;
extern Date420 D_80196A30;
s32 func_000424bc(Date420 *date);
s32 func_0004260c(Date420 *date);

void func_000491e0(s16 n) {
    s16 i;
    if (n >= 0) {
        func_00047ee0(0x43, 3);
        for (i = 0; i < n; i++) {
            func_000424bc(&D_80196A30);
            func_00047ee0(0x43, 3);
        }
    } else {
        for (n++; n != 1; n++) {
            func_0004260c(&D_80196A30);
        }
    }
}
