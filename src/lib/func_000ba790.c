typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
typedef struct ListMenu {
    u16 page;
    u16 unk02;
    u16 h4;
    u16 cur;
    u16 unk08;
    u16 hA;
    u16 unk0C;
    u16 top;
    u8 unk10[9];
    u8 mode;
} ListMenu;
void func_000ba790(ListMenu *m) {
    if (m->page == 0) {
        m->page = 2;
    }
    if (m->page == 4) {
        s32 n = (*(s32 *)((u8 *)(D_80196AF8) + (0x5DC)));
        if (n == 0) {
            m->page = 3;
            m->cur = 0;
            m->top = 0;
        } else if (m->cur >= n) {
            m->cur = n - 1;
        }
    }
    if (m->page == 3) {
        u8 *b = D_80196AF8;
        s32 n = (*(s32 *)((u8 *)(b) + (0x2C0)));
        if (n == 0) {
            if (m->mode == 2 && (*(s32 *)((u8 *)(b) + (0x5DC))) != 0) {
                m->page = 4;
                m->cur = 0;
                m->top = 0;
                (*(u16 *)((u8 *)(b) + (0x198))) = 0;
            } else {
                m->page = 2;
                m->cur = 0;
                m->top = 0;
            }
        } else if (m->cur >= n) {
            m->cur = n - 1;
        }
    }
    if (m->page == 2) {
        u8 *b = D_80196AF8;
        if (m->cur > (*(s32 *)((u8 *)(b) + (0x5D4)))) {
            m->cur = (*(s32 *)((u8 *)(b) + (0x5D4)));
        }
    }
    m->hA = m->h4 = (*(u16 *)((u8 *)(D_80196AF8) + (0x182))) = m->page;
}
