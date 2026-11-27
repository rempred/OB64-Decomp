#include "game/panel_rect_call.h"
#include "game/panel_constructor.h"
extern u8 *D_8021EEF4;
extern u8 D_8021EEF8;
extern u8 D_8021EEF9;
extern u8 D_8021EEFA;
extern u8 D_8021EEFB;
extern s32 D_80214F4C;
void func_0016B430(s16 k);
void D_8020CDA0(s32 k);
extern u8 D_800E7A32[];
typedef struct {
    void (*update)(void);
    void (*draw)(void);
    void (*exit)(void);
    u16 size;
} Funcs167;
extern Funcs167 D_800E7A44;
extern u8 D_800E7A33;
extern s32 D_800E7A54;
extern s16 D_800E91D0;
void func_0016BB6C(void);
void func_0016C8B8(void);
typedef struct {
    s16 v[8];
} Rect167;
typedef struct {
    Rect167 r[4];
} Rects167;
extern Rects167 D_80220CF0;
extern u8 D_800E9C0A[];
struct Panel *D_8017F36C(unsigned short id);
void func_0016C98C(Panel *, s32);
void func_0016B430(s16 k) {
    Rects167 rc = D_80220CF0;
    u8 *flags = D_800E7A32;
    Panel *w;
    u8 *p9;
    D_800E7A44.update = func_0016BB6C;
    D_800E7A44.draw = func_0016C8B8;
    D_800E7A44.size = 0x7C;
    D_800E7A54 = 0;
    D_800E91D0 = k;
    *flags |= 8;
    D_800E7A33 |= 1;
    *flags |= 9;
    D_8021EEF4[0x5C] = 0;
    D_8021EEF4[0x5D] = 0;
    D_8021EEF4[0x5E] = 0;
    p9 = &D_8021EEF9;
    D_8021EEF4[0x5F] = 0;
    D_8021EEF4[0x60] = *p9;
    D_8021EEF4[0x61] = D_8021EEF8;
    D_8021EEF4[0x62] = *p9;
    D_8021EEF4[0x63] = D_8021EEFA;
    D_8021EEF4[0x76] = D_8021EEFB;
    D_8021EEF4[0x77] = 2;
    D_8021EEF4[0x74] = 2;
    D_8021EEF4[0x75] = 0;
    D_80214F4C = 0;
    D_8021EEF4[0x78] = 0;
    D_8021EEF4[0x79] = 0x90;
    w = D_8017BFB0(0x400, 0, func_0016C98C, rc.r[3].v[0], rc.r[3].v[1], rc.r[3].v[2], rc.r[3].v[3],
                      rc.r[3].v[4], rc.r[3].v[5], rc.r[3].v[6], rc.r[3].v[7]);
    (*(Panel **)((u8 *)D_8021EEF4 + 0x6C)) = w;
    w->flags |= 8;
    (*(u8 * *)((u8 *)(D_8021EEF4) + (0x6C)))[0x23] = 2;
    if (D_800E9C0A[6] != 0) {
        D_8017EF24(0x17081, 0x1100, 0x98, 0xAC, 0xA8, 0xBC, 0x18, 0xA0, 0x128, 0xC8);
        (*(u8 * *)((u8 *)(D_8017F36C(0x1100)) + (0xD0)))[0x5F4] = 2;
        D_8020CDA0(0x10);
    }
}
void func_0016C8B8(void);
