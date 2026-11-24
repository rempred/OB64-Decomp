typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u16 flags;
    u8 pref;
    u8 unk03[0x21];
} LocationRec;
extern LocationRec D_801951CC[];
typedef struct {
    u32 flags;
    u8 squad;
    u8 unk05[3];
    f32 x;
    f32 y;
    f32 z;
    s32 unk14;
    f32 heading;
    u8 unk1C[0x30];
    f32 savedX;
    f32 savedY;
    f32 savedZ;
    u8 unk58[0xC];
    s32 unk64;
    u8 unk68[0xC];
    s32 loc;
    u8 unk78[8];
    s32 unk80;
    s32 unk84;
    u8 unk88[9];
    u8 unk91;
    u8 unk92;
    u8 unk93[0xD];
    struct PathJob *job;
    u8 unkA4[4];
    s32 *ids;
    u8 unkAC[0xE];
    u8 unkBA;
} MapUnit;
void D_801B2D2C(void *u);
typedef struct PathJob {
    s32 from;
    s32 to;
    s32 unk08;
    s32 unk0C;
    s32 w;
    s32 h;
    f32 *bounds;
    u8 *cells;
    s32 *cost;
    s32 *prev;
    s32 done;
    s32 unk2C;
    void *open;
    s32 unk34[2];
    s32 unk3C;
} PathJob;
void func_00131A14(MapUnit *u, s32 a, s32 b) {
    if (u->flags & 0x40) {
        return;
    }
    D_801B2D2C(u);
    u->unk92 = 0;
    u->unk91 = 0;
    u->unk84 = -1;
    u->unk80 = -1;
    u->flags &= ~0x2000;
    u->flags &= ~0x800000;
    if (b == 0 && ((u)->loc) != -1 && (D_801951CC[((u)->loc)].flags & 2)) {
        u->flags |= 0x800000;
        u->savedX = u->x;
        u->savedY = u->y;
        u->savedZ = u->z;
        u->unk64 = u->unk14;
    } else {
        u->unk92 = b;
    }
    u->unk91 = a;
    if (a == 1 && b == 1) {
        u->unk88[8] = 1;
    } else if (a == 2 && b == 2) {
        u->unk88[8] = 2;
    } else if (a == 0 && b == 0) {
        u->unk88[8] = 0;
    } else {
        u->unk88[8] = 3;
    }
}
