typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
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
extern u8 D_8019EE48;
extern u8 D_80198BE8[];
s32 func_000ec9ec(u8 k) {
    s32 i;
    for (i = 0; i < 6; i++) {
        if ((g_state_slot_records[i].flags & 0x8000) && g_state_slot_records[i].owner == D_80198BE8 && g_state_slot_records[i].unk8F == k) {
            return (g_state_slot_records[i].unk8A & 1) * 2;
        }
    }
    return (-((D_8019EE48 & 2) != 0) & 3) | 1;
}
