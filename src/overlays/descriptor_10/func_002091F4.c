typedef unsigned char u8;
typedef signed int s32;
void *func_000016C4(void *ptr);
extern u8 *D_801CFA70;
typedef struct {
    void *img[3];
    u8 pad[0x18];
} ResSet208;
typedef struct {
    void *img;
    u8 pad[0xC];
} ResSlot208;
typedef struct {
    ResSet208 set[2];
    u8 pad48[0xC];
    ResSlot208 slot[30];
} Res208;
void func_002091F4(void) {
    s32 i;
    if (D_801CFA70 == ((void *)0)) {
        return;
    }
    for (i = 0; i < 2; i++) {
        func_000016C4(((Res208 *)D_801CFA70)->set[i].img[0]);
        func_000016C4(((Res208 *)D_801CFA70)->set[i].img[1]);
        func_000016C4(((Res208 *)D_801CFA70)->set[i].img[2]);
    }
    for (i = 0; i < sizeof(((Res208 *)0)->slot) / sizeof(ResSlot208); i++) {
        func_000016C4(((Res208 *)D_801CFA70)->slot[i].img);
    }
    func_000016C4((*(void * *)((u8 *)(D_801CFA70) + (0x234))));
    func_000016C4((*(void * *)((u8 *)(D_801CFA70) + (0x238))));
    func_000016C4((*(void * *)((u8 *)(D_801CFA70) + (0x23C))));
    func_000016C4((*(void * *)((u8 *)(D_801CFA70) + (0x228))));
    func_000016C4((*(void * *)((u8 *)(D_801CFA70) + (0x22C))));
    func_000016C4((*(void * *)((u8 *)(D_801CFA70) + (0x230))));
    func_000016C4((*(void * *)((u8 *)(D_801CFA70) + (0x248))));
    func_000016C4((*(void * *)((u8 *)(D_801CFA70) + (0x244))));
    func_000016C4((*(void * *)((u8 *)(D_801CFA70) + (0x240))));
    func_000016C4(D_801CFA70);
    D_801CFA70 = ((void *)0);
}
