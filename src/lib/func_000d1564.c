typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
typedef struct {
    u16 cur;
    u16 top;
    u16 page;
    u16 total;
} ListD03;
extern u16 D_80196B00[][2];
u16 func_000bb47c(s32, s32, s32);
u16 func_000bb34c(s32 a, u8 item, u8 c);
u16 func_000bc718(u16);
void func_000d1564(u8 item) {
    u16 sel;
    ListD03 *l;
    s32 i;
    if ((item == 0) | (item >= 100)) {
        sel = 0;
        (*(s32 *)((u8 *)(D_80196AF8) + (0x24FC))) = 0;
        D_80196AF8[0x1DED] = 1;
    } else {
        sel = func_000bb47c(0, item, D_80196AF8[0x1E21]);
        if (sel == 0) {
            (*(s32 *)((u8 *)(D_80196AF8) + (0x24FC))) = 0;
            D_80196AF8[0x1DED] = 1;
        } else {
            (*(s32 *)((u8 *)(D_80196AF8) + (0x24FC))) = func_000bb34c(0, item, D_80196AF8[0x1E21]);
            D_80196AF8[0x1DED] = func_000bc718(sel);
        }
    }
    l = (ListD03 *)(D_80196AF8 + 0x1BDA);
    l->page = 4;
    l->total = D_80196AF8[0x1DED] - 1;
    for (i = 0; i < l->total; i++) {
        if (sel == D_80196B00[(*(u16 *)((u8 *)(D_80196AF8 + i * 2) + (0x1BEE)))][0]) {
            break;
        }
    }
    l->cur = i;
    if (i < l->page) {
        l->top = 0;
    } else if (l->total - l->page < i) {
        l->top = l->total - l->page + 1;
    } else {
        l->top = i;
    }
}
