typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void *func_000016C4(void *ptr);
typedef struct {
    u8 *spr;
    u8 unk04[0x2C];
    u8 *spr2;
    u8 unk34[0x2C];
    u8 *units;
    u32 nUnits;
    u8 *objs;
    void *buf6C;
    u32 nObjs;
    s32 unk74;
    void *buf78;
    void *buf7C;
    void *buf80;
    u8 unk84[0x1C];
} State1F8;
extern State1F8 D_801D0770;
void bzero(void *p, s32 n);
extern inline void func_001FB14C(u8 *p) {
    if (p != ((void *)0)) {
        if (p[0] == 'B' && p[1] == '5') {
            u8 *bank = p;
            u8 *e = *(u8 **)(p + 0x14);
            u32 i;
            for (i = 1; i < bank[3]; i++) {
                u8 *cur = e;
                e = *(u8 **)(cur + 0xC);
                func_000016C4(cur);
            }
        }
        func_000016C4(p);
    }
}
void func_001F0F90(s32 o);
void func_00205988(s32 a, s32 b);
void func_00200684(void);
void func_001FF108(void) {
    u32 i;
    func_00200684();
    func_001FB14C(D_801D0770.spr);
    func_001FB14C(D_801D0770.spr2);
    func_000016C4(D_801D0770.buf78);
    func_000016C4(D_801D0770.buf7C);
    func_000016C4(D_801D0770.buf80);
    for (i = 0; i < D_801D0770.nObjs; i++) {
        func_001F0F90(*(s32 *)(D_801D0770.objs + i * 0xF8));
    }
    func_000016C4(D_801D0770.objs);
    func_000016C4(D_801D0770.buf6C);
    for (i = 0; i < D_801D0770.nUnits; i++) {
        func_00205988((*(s32 *)((u8 *)(D_801D0770.units + i * 0x64) + (0x14))), (*(u16 *)((u8 *)(D_801D0770.units + i * 0x64) + (6))));
    }
    func_000016C4(D_801D0770.units);
    bzero(&D_801D0770, sizeof(State1F8));
}
