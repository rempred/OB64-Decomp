struct Panel;
#include "game/panel_constructor.h"
void *func_000016C4(void *ptr);
void D_8017C584(Panel *, s32);
struct Panel *D_8017F36C(unsigned short id);
struct Panel * D_8017F334(unsigned short);
void D_801807F4(Panel *w, s32 a);
void func_001A58BC(s32 a) {
    Panel *w;
    if (D_8017F36C(5) == 0) {
        w = D_8017BFB0(5, 0, D_8017C584, 0x98, 0xAA, 0xA8, 0xBA, 0x1C, 0x9E, 0x124, 0xC6);
    } else {
        w = D_8017F334(5);
        func_000016C4((*(void * *)((u8 *)(w) + (0xD0))));
    }
    D_801807F4(w, a);
}
