typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u16 flags;
    u8 flags2;
    u8 flags3;
    u8 unk04[2];
    s16 x;
    s16 y;
    s16 x2;
    s16 y2;
    u16 unk0E;
    void *owner;
    void (*update)(s32 slot);
    void (*draw)(s32 slot);
    void (*exit)(s32 slot);
    u16 size;
    u8 unk22[2];
    u8 *data;
    s16 unk28;
    s16 unk2A;
    u16 unk2C;
    u16 unk2E;
    u8 unk30[8];
    void *slotsA[10];
    void *slotsB[10];
    u8 unk88;
    u8 unk89;
    u8 unk8A;
    u8 unk8B;
    u8 unk8C;
    u8 unk8D;
    u8 unk8E;
    u8 unk8F;
    u8 unk90[4];
    u8 unk94;
    u8 unk95;
    u8 unk96;
    u8 unk97;
    void *unk98;
    u8 unk9C[4];
    u8 unkA0;
    u8 unkA1;
    s16 parent;
    u8 unkA4[4];
} Scene;
extern Scene g_state_slot_records[];
extern s16 D_800E7A36;
extern s16 D_800E7A38;
extern s16 D_800E7A3A;
extern s16 D_800E7A3C;
extern u8 *D_801AB850;
extern u8 D_801936E0;
extern s32 D_801AB84C;
extern struct {
    u8 pad[0x29];
    u8 b29;
    u8 pad2A[6];
    u8 b30;
} D_800E7A90;
extern s32 D_8018F58C;
extern s32 D_801F0DE0;
extern u8 **D_800C4BE0;
extern u8 D_80196AEE[];
extern u8 D_801971E4[];
extern u16 D_800E7A30;
extern u8 D_800E7A32;
s32 D_801AE860(void);
void D_8022A840(void);
void D_80221030(void);
void D_801F6E14(s32 a);
void func_000ecc4c(u32 d);
void func_000eccb8(u32 d);
void func_000ec33c(void) {
    s32 i;
    D_801AB850[6] = D_800C4BE0[0][2];
    D_801AB850[7] = D_800C4BE0[0][3];
    for (i = 0; i < 4; i++) {
        D_80196AEE[i] = D_800C4BE0[i][2];
        D_801971E4[i] = D_800C4BE0[i][3];
    }
    D_8018F58C = ((s32 *)&D_800E7A90)[D_800E7A90.b30 - 10];
    if (!(g_state_slot_records[D_800E7A90.b29].flags & 0x1000) && !(D_800E7A30 & 0x1000)) {
        g_state_slot_records[D_800E7A90.b29].x = D_800E7A36;
        g_state_slot_records[D_800E7A90.b29].y = D_800E7A38;
        g_state_slot_records[D_800E7A90.b29].x2 = D_800E7A3A;
        g_state_slot_records[D_800E7A90.b29].y2 = D_800E7A3C;
    }
    if (D_801936E0 != 0) {
        D_8022A840();
    }
    D_801AB850[5] = 0;
    D_801AB84C = D_801AE860();
    if (D_801AB84C == 0) {
        func_000ecf94();
        if (D_801F0DE0 != 0x13) {
            D_801F6E14(D_8018F58C);
        }
    }
    func_000ecbe0(0x1000);
    func_000ecc4c(0x1000);
    func_000eccb8(0x1000);
    if (D_801936E0 != 0) {
        D_80221030();
    }
    if (D_801AB84C != 0) {
        u8 *f = &D_800E7A32;
        *f |= 2;
    }
}
void func_000ecbe0(u32 d);
void func_000ecc4c(u32 d);
void func_000eccb8(u32 d);
void func_000ecf94(void);
