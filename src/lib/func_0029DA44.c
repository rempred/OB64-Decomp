typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;
void *func_000016C4(void *ptr);
typedef struct {
    u8 unk000[0xE8];
    s32 wE8;
    s32 wEC;
    s32 wF0;
    s32 wF4;
    s32 wF8;
    u8 unk0FC[0x20];
    f32 f11C;
    f32 f120;
    f32 f124;
    s32 w128;
    f32 f12C;
    f32 f130;
    s16 h134;
    s16 h136;
    u8 unk138[2];
    s16 h13A;
    u8 unk13C;
    u8 b13D;
    u8 unk13E[7];
    u8 b145;
    u8 b146;
    u8 b147;
    u8 unk148;
    u8 b149;
} BUnit;
typedef struct {
    f32 f0;
    u8 unk4[4];
    f32 f8;
    s16 hC;
    u8 bE;
} BObj;
typedef struct {
    u8 unk00[0x18];
    BUnit *units[0x38];
    BObj *objs[1];
} Battle;
extern Battle *D_8022A974;
extern u8 D_8018FC19;
extern s16 *D_8022A97C;
void func_0029D8BC(void);
void D_80079618();
void D_8017BED4(void);
void func_002A4680(void);
void func_0029D8BC(void);
void func_002A2210(s32 a);
void func_0029B82C(void);
void D_802281B4(void);
void D_80179058(void);
void D_80179018(void);
void D_80239710(void);
void func_0029C530(void);
void D_8023D318(void);
void D_8023AB3C(void);
void D_8023E904(void);
void D_8023AA54(void);
void D_802408A8(s32 a, s32 b);
void D_8023A7C4(void);
void D_80227778(s32 a);
void D_80236470(void);
void func_0029B60C(void);
void func_0029AC44(s32 a);
void D_8023E2E8(void);
s32 D_802276EC(void);
void D_8022767C(void);
extern void *D_80238A90;
extern u8 D_8022A980;
extern u8 *D_8018FDC0;
extern s16 D_8018F1A0;
void func_0029DA44(void) {
    D_8017BED4();
    func_002A4680();
    func_0029D8BC();
    func_002A2210(0);
    func_0029B82C();
    D_802281B4();
    func_000016C4(D_80238A90);
    D_80238A90 = ((void *)0);
    if (D_8018FC19 != 2) {
        if ((*(void * *)((u8 *)(D_8022A974) + (0x1BB0))) != ((void *)0)) {
            func_000016C4((*(void * *)((u8 *)((*(void * *)((u8 *)(D_8022A974) + (0x1BB0)))) + (4))));
            func_000016C4((*(void * *)((u8 *)(D_8022A974) + (0x1BB0))));
        }
    }
    func_000016C4(D_8022A97C);
    D_8022A97C = ((void *)0);
    D_80079618(0x02093576, 0, -0x11);
    D_80079618(-0x11);
    D_80179058();
    D_80179018();
    if (D_8018FC19 != 2) {
        D_80239710();
    }
    func_0029C530();
    if (D_8018FC19 == 0) {
        D_8023D318();
        D_8023AB3C();
        D_8023E904();
        D_8023AA54();
        D_802408A8(-1, 0);
        D_8023A7C4();
    }
    D_80227778(-1);
    D_80236470();
    func_0029B60C();
    func_0029AC44(-1);
    if (D_8018FC19 == 2) {
        D_8023E2E8();
    }
    if ((u8)D_802276EC() == 0xD7) {
        D_8022A980 = 0xFE;
    }
    D_8022767C();
    func_000016C4(D_8022A974);
    D_8022A974 = ((void *)0);
    D_8018FDC0[0xD2] = 0;
    D_8018F1A0 = 0;
}
extern u8 D_8018FC19;
