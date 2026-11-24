typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
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
typedef struct { s32 v[3]; } Pt29C;
void func_0029CD64(s32 *a, f32 *out, s32 b, s32 c);
extern Pt29C D_80239240;
void func_002A0390(s32 a0, s32 a1, s32 a2, s32 arg0);
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
    u8 unk14[0x14];
    s16 unk28;
    s16 unk2A;
    u8 unk2C[0xC];
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
    u8 unk98[0xA];
    s16 parent;
    u8 unkA4[4];
} Scene;
extern Scene g_state_slot_records[];
void func_002A0390(s32 a0, s32 a1, s32 a2, s32 arg0) {
    Pt29C p;
    f32 out[2];
    s16 i;
    p = D_80239240;
    for (i = 0; i < 0x1C; i++) {
        s16 *o = ((s16 **)((u8 *)D_8022A974 + 0x1D8))[i];
        u32 y;
        if (o != ((void *)0) && (y = (u32)D_8022A974->units[i]) != 0) {
            s16 n = o[0];
            if (!(g_state_slot_records[n].unk8A & 0x40) && (g_state_slot_records[n].flags & 0x8000)) {
                func_0029CD64(p.v, out, y + 0xA0, arg0);
                arg0 = out[0];
                if (out[1] < (s16)(o[2] * 14 + 0x31)) {
                    y = (s32)out[1] - 0x14;
                } else {
                    y = (s32)out[1] - 0x2D;
                }
                {
                    u8 xh = (u32)arg0 >> 8;
                    u8 yh = y >> 8;
                    g_state_slot_records[n].unk8C = xh;
                    g_state_slot_records[n].unk8D = arg0;
                    g_state_slot_records[n].unk94 = yh;
                    g_state_slot_records[n].unk95 = y;
                }
            }
        }
    }
}
