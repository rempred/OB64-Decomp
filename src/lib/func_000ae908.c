typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void *func_000016C4(void *ptr);
typedef struct {
    u16 v[3];
} Cursor3;
typedef struct {
    s32 n;
    s32 unk4;
    s32 x;
    s32 y;
} Bob87;
typedef struct {
    u8 unk0000[0x92];
    u8 b92;
    u8 b93;
    u8 b94;
    u8 b95;
    u8 b96;
    u8 unk0097;
    u8 b98;
    u8 unk0099[0xD];
    u16 sp;
    Cursor3 stack[20];
    Cursor3 cur;
    u8 unk0126[6];
    u16 h12C;
    u8 unk012E[0xF76];
    Bob87 bob[8];
    u8 unk1124[0x5C];
    u8 rows[1][0x36];
} Menu87;
extern Menu87 *D_80196AF8;
void func_00019e10(void);
extern u8 D_801939D8;
extern u8 D_801939D0;
extern u8 D_801936E0;
void D_80199E00(void *p);
void D_80197DB8(void);
void func_000c1d68(void);
void D_80221CB8(void);
void func_000ae908(void) {
    func_00019e10();
    D_801939D8 = 0;
    *(s16 *)&D_80196AF8->cur.v[0] = -1;
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x58))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x4C))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x48))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x28))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x24))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x20))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x60))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x5C))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x1C))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x18))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x14))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x10))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x2C))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0xC))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x30))));
    if ((*(void * *)((u8 *)(D_80196AF8) + (0x34))) != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x34))));
    }
    if ((*(void * *)((u8 *)(D_80196AF8) + (0x38))) != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x38))));
    }
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x3C))));
    if ((*(void * *)((u8 *)(D_80196AF8) + (0x40))) != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x40))));
    }
    if ((*(void * *)((u8 *)(D_80196AF8) + (0x44))) != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x44))));
    }
    if ((*(void * *)((u8 *)(D_80196AF8) + (0x50))) != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x50))));
    }
    if ((*(void * *)((u8 *)(D_80196AF8) + (0x54))) != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x54))));
    }
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x8))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x4))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x68))));
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x6C))));
    D_80199E00((*(void * *)((u8 *)(D_80196AF8) + (0x24F0))));
    D_80199E00((*(void * *)((u8 *)(D_80196AF8) + (0x24F4))));
    D_80197DB8();
    func_000c1d68();
    func_000016C4((*(void * *)((u8 *)(D_80196AF8) + (0x0))));
    func_000016C4(D_80196AF8);
    D_80196AF8 = ((void *)0);
    D_801939D0 = 0;
    if (D_801936E0 != 0) {
        D_80221CB8();
    }
}
