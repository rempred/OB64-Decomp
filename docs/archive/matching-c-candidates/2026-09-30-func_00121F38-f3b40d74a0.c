typedef signed char s8;
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef double f64;
#define M2C_FIELD(base,type,offset) (*(type)((s8 *)(base)+(offset)))
/* Four contiguous float operands form a typed view of the existing data.
   The member accesses reproduce this compiler's per-point alias/reload behavior;
   this does not establish the original source declaration. */
typedef struct WakeBounds {
    f32 field_00;
    f32 field_04;
    f32 field_08;
    f32 field_0C;
} WakeBounds;
extern WakeBounds D_801F0D98;
extern u8 D_800E7AB9;
extern f64 D_801EE610;
extern f64 D_801EE618;
extern f64 D_801EE620;
extern f64 D_801EE628;
extern f64 D_801EE630;
extern u8 D_801971F1[];

f32 func_000F315C(u8, f32, f32);                    /* extern */
f32 func_000F3428(u8, f32, f32);                    /* extern */
void func_001072B8(void *);                      /* extern */
void func_0012EA80(s32, f32 *);                  /* extern */


/* Full-owner research. By-value arguments retain each point across cleanup. */
static inline s32 wake_grid_cell(f32 x, f32 z)
{
    f32 base_z;
    f32 base_x;
    /* Retail reloads each bound for every point. These scoped qualifiers
       inhibit this compiler's reuse across inlined point stores. */
    base_z = D_801F0D98.field_04;
    z -= base_z;
    z *= 64.0f;
    z /= D_801F0D98.field_0C - base_z;
    base_x = D_801F0D98.field_00;
    x -= base_x;
    x *= 64.0f;
    x /= D_801F0D98.field_08 - base_x;
    return ((s32)z << 6) + (s32)x;
}

static inline void wake_publish1_mode0(void *unit, f32 x0, f32 y0, f32 z0, s32 tag)
{
    u32 flags;
    func_001072B8(unit);
    flags = M2C_FIELD(unit, u32 *, 0);
    M2C_FIELD(unit, s32 *, 0x84) = -1;
    M2C_FIELD(unit, s32 *, 0x80) = -1;
    M2C_FIELD(unit, u8 *, 0x91) = 0;
    M2C_FIELD(unit, s32 *, 0x88) = 0;
    M2C_FIELD(unit, u8 *, 0x92) = 0;
    M2C_FIELD(unit, u32 *, 0) = flags & ~2;
    M2C_FIELD(unit, f32 *, 0x28) = x0;
    M2C_FIELD(unit, f32 *, 0x2c) = y0;
    M2C_FIELD(unit, f32 *, 0x30) = z0;
    M2C_FIELD(unit, s32 *, 0x58) = wake_grid_cell(x0, z0);
    M2C_FIELD(unit, u8 *, 0x20) = 1;
    M2C_FIELD(unit, s32 *, 0x24) = tag;
    M2C_FIELD(unit, u32 *, 0) &= ~4;
    M2C_FIELD(unit, u32 *, 0) &= ~0x200;
    M2C_FIELD(unit, u32 *, 0) |= 2;
    M2C_FIELD(unit, u32 *, 0) &= ~0x00800000;
}

static inline void wake_publish1_mode1(void *unit, f32 x0, f32 y0, f32 z0, s32 tag)
{
    u32 flags;
    func_001072B8(unit);
    flags = M2C_FIELD(unit, u32 *, 0);
    M2C_FIELD(unit, u8 *, 0x91) = 0;
    M2C_FIELD(unit, s32 *, 0x84) = -1;
    M2C_FIELD(unit, s32 *, 0x80) = -1;
    M2C_FIELD(unit, s32 *, 0x88) = 0;
    M2C_FIELD(unit, u8 *, 0x92) = 0;
    M2C_FIELD(unit, u32 *, 0) = flags & ~2;
    M2C_FIELD(unit, f32 *, 0x28) = x0;
    M2C_FIELD(unit, f32 *, 0x2c) = y0;
    M2C_FIELD(unit, f32 *, 0x30) = z0;
    M2C_FIELD(unit, s32 *, 0x58) = wake_grid_cell(x0, z0);
    M2C_FIELD(unit, u8 *, 0x20) = 1;
    M2C_FIELD(unit, u8 *, 0x91) = 1;
    M2C_FIELD(unit, s32 *, 0x24) = tag;
    M2C_FIELD(unit, s32 *, 0x84) = -1;
    M2C_FIELD(unit, u32 *, 0) &= ~4;
    M2C_FIELD(unit, u32 *, 0) &= ~0x200;
    M2C_FIELD(unit, u32 *, 0) |= 2;
    M2C_FIELD(unit, u32 *, 0) &= ~0x00800000;
}

static inline void wake_publish1_mode2(void *unit, f32 x0, f32 y0, f32 z0, s32 tag)
{
    u32 flags;
    func_001072B8(unit);
    flags = M2C_FIELD(unit, u32 *, 0);
    M2C_FIELD(unit, u8 *, 0x91) = 0;
    M2C_FIELD(unit, s32 *, 0x84) = -1;
    M2C_FIELD(unit, s32 *, 0x80) = -1;
    M2C_FIELD(unit, s32 *, 0x88) = 0;
    M2C_FIELD(unit, u8 *, 0x92) = 0;
    M2C_FIELD(unit, u32 *, 0) = flags & ~2;
    M2C_FIELD(unit, f32 *, 0x28) = x0;
    M2C_FIELD(unit, f32 *, 0x2c) = y0;
    M2C_FIELD(unit, f32 *, 0x30) = z0;
    M2C_FIELD(unit, s32 *, 0x58) = wake_grid_cell(x0, z0);
    M2C_FIELD(unit, u8 *, 0x20) = 1;
    M2C_FIELD(unit, u8 *, 0x91) = 2;
    M2C_FIELD(unit, s32 *, 0x88) = 90;
    M2C_FIELD(unit, s32 *, 0x24) = tag;
    M2C_FIELD(unit, s32 *, 0x84) = -1;
    M2C_FIELD(unit, u32 *, 0) &= ~4;
    M2C_FIELD(unit, u32 *, 0) &= ~0x200;
    M2C_FIELD(unit, u32 *, 0) |= 2;
    M2C_FIELD(unit, u32 *, 0) &= ~0x00800000;
}

static inline void wake_publish2_mode0(void *unit, f32 x0, f32 y0, f32 z0, f32 x1, f32 y1, f32 z1, s32 tag)
{
    u32 flags;
    func_001072B8(unit);
    flags = M2C_FIELD(unit, u32 *, 0);
    M2C_FIELD(unit, s32 *, 0x84) = -1;
    M2C_FIELD(unit, s32 *, 0x80) = -1;
    M2C_FIELD(unit, u8 *, 0x91) = 0;
    M2C_FIELD(unit, s32 *, 0x88) = 0;
    M2C_FIELD(unit, u8 *, 0x92) = 0;
    M2C_FIELD(unit, u32 *, 0) = flags & ~2;
    M2C_FIELD(unit, f32 *, 0x28) = x0;
    M2C_FIELD(unit, f32 *, 0x2c) = y0;
    M2C_FIELD(unit, f32 *, 0x30) = z0;
    M2C_FIELD(unit, s32 *, 0x58) = wake_grid_cell(x0, z0);
    M2C_FIELD(unit, f32 *, 0x34) = x1;
    M2C_FIELD(unit, f32 *, 0x38) = y1;
    M2C_FIELD(unit, f32 *, 0x3c) = z1;
    M2C_FIELD(unit, s32 *, 0x5c) = wake_grid_cell(x1, z1);
    M2C_FIELD(unit, u8 *, 0x20) = 2;
    M2C_FIELD(unit, s32 *, 0x24) = tag;
    M2C_FIELD(unit, u32 *, 0) &= ~4;
    M2C_FIELD(unit, u32 *, 0) &= ~0x200;
    M2C_FIELD(unit, u32 *, 0) |= 2;
    M2C_FIELD(unit, u32 *, 0) &= ~0x00800000;
}

static inline void wake_publish2_mode1(void *unit, f32 x0, f32 y0, f32 z0, f32 x1, f32 y1, f32 z1, s32 tag)
{
    u32 flags;
    func_001072B8(unit);
    flags = M2C_FIELD(unit, u32 *, 0);
    M2C_FIELD(unit, u8 *, 0x91) = 0;
    M2C_FIELD(unit, s32 *, 0x84) = -1;
    M2C_FIELD(unit, s32 *, 0x80) = -1;
    M2C_FIELD(unit, s32 *, 0x88) = 0;
    M2C_FIELD(unit, u8 *, 0x92) = 0;
    M2C_FIELD(unit, u32 *, 0) = flags & ~2;
    M2C_FIELD(unit, f32 *, 0x28) = x0;
    M2C_FIELD(unit, f32 *, 0x2c) = y0;
    M2C_FIELD(unit, f32 *, 0x30) = z0;
    M2C_FIELD(unit, s32 *, 0x58) = wake_grid_cell(x0, z0);
    M2C_FIELD(unit, f32 *, 0x34) = x1;
    M2C_FIELD(unit, f32 *, 0x38) = y1;
    M2C_FIELD(unit, f32 *, 0x3c) = z1;
    M2C_FIELD(unit, s32 *, 0x5c) = wake_grid_cell(x1, z1);
    M2C_FIELD(unit, u8 *, 0x20) = 2;
    M2C_FIELD(unit, u32 *, 0) &= ~4;
    M2C_FIELD(unit, u32 *, 0) &= ~0x200;
    M2C_FIELD(unit, u32 *, 0) |= 2;
    M2C_FIELD(unit, u32 *, 0) &= ~0x00800000;
    M2C_FIELD(unit, s32 *, 0x24) = tag;
    M2C_FIELD(unit, u8 *, 0x91) = 1;
    M2C_FIELD(unit, s32 *, 0x84) = -1;
}

static inline void wake_publish2_mode2(void *unit, f32 x0, f32 y0, f32 z0, f32 x1, f32 y1, f32 z1, s32 tag)
{
    u32 flags;
    func_001072B8(unit);
    flags = M2C_FIELD(unit, u32 *, 0);
    M2C_FIELD(unit, u8 *, 0x91) = 0;
    M2C_FIELD(unit, s32 *, 0x84) = -1;
    M2C_FIELD(unit, s32 *, 0x80) = -1;
    M2C_FIELD(unit, s32 *, 0x88) = 0;
    M2C_FIELD(unit, u8 *, 0x92) = 0;
    M2C_FIELD(unit, u32 *, 0) = flags & ~2;
    M2C_FIELD(unit, f32 *, 0x28) = x0;
    M2C_FIELD(unit, f32 *, 0x2c) = y0;
    M2C_FIELD(unit, f32 *, 0x30) = z0;
    M2C_FIELD(unit, s32 *, 0x58) = wake_grid_cell(x0, z0);
    M2C_FIELD(unit, f32 *, 0x34) = x1;
    M2C_FIELD(unit, f32 *, 0x38) = y1;
    M2C_FIELD(unit, f32 *, 0x3c) = z1;
    M2C_FIELD(unit, s32 *, 0x5c) = wake_grid_cell(x1, z1);
    M2C_FIELD(unit, u32 *, 0) &= ~4;
    M2C_FIELD(unit, u32 *, 0) &= ~0x200;
    M2C_FIELD(unit, u32 *, 0) |= 2;
    M2C_FIELD(unit, u32 *, 0) &= ~0x00800000;
    M2C_FIELD(unit, u8 *, 0x20) = 2;
    M2C_FIELD(unit, s32 *, 0x24) = tag;
    M2C_FIELD(unit, u8 *, 0x91) = 2;
    M2C_FIELD(unit, s32 *, 0x84) = -1;
    M2C_FIELD(unit, s32 *, 0x88) = 90;
}

static inline void wake_publish3_mode0(void *unit, f32 x0, u32 y0, f32 z0, f32 x1, u32 y1, f32 z1, f32 x2, u32 y2, f32 z2, s32 tag)
{
    u32 flags;
    func_001072B8(unit);
    flags = M2C_FIELD(unit, u32 *, 0);
    M2C_FIELD(unit, s32 *, 0x84) = -1;
    M2C_FIELD(unit, s32 *, 0x80) = -1;
    M2C_FIELD(unit, u8 *, 0x91) = 0;
    M2C_FIELD(unit, s32 *, 0x88) = 0;
    M2C_FIELD(unit, u8 *, 0x92) = 0;
    M2C_FIELD(unit, u32 *, 0) = flags & ~2;
    M2C_FIELD(unit, f32 *, 0x28) = x0;
    M2C_FIELD(unit, u32 *, 0x2c) = y0;
    M2C_FIELD(unit, f32 *, 0x30) = z0;
    M2C_FIELD(unit, s32 *, 0x58) = wake_grid_cell(x0, z0);
    M2C_FIELD(unit, f32 *, 0x34) = x1;
    M2C_FIELD(unit, u32 *, 0x38) = y1;
    M2C_FIELD(unit, f32 *, 0x3c) = z1;
    M2C_FIELD(unit, s32 *, 0x5c) = wake_grid_cell(x1, z1);
    M2C_FIELD(unit, f32 *, 0x40) = x2;
    M2C_FIELD(unit, u32 *, 0x44) = y2;
    M2C_FIELD(unit, f32 *, 0x48) = z2;
    M2C_FIELD(unit, s32 *, 0x60) = wake_grid_cell(x2, z2);
    M2C_FIELD(unit, u8 *, 0x20) = 3;
    M2C_FIELD(unit, s32 *, 0x24) = tag;
    M2C_FIELD(unit, u32 *, 0) &= ~4;
    M2C_FIELD(unit, u32 *, 0) &= ~0x200;
    M2C_FIELD(unit, u32 *, 0) |= 2;
    M2C_FIELD(unit, u32 *, 0) &= ~0x00800000;
}

static inline void wake_publish3_mode1(void *unit, f32 x0, u32 y0, f32 z0, f32 x1, u32 y1, f32 z1, f32 x2, u32 y2, f32 z2, s32 tag)
{
    u32 flags;
    func_001072B8(unit);
    flags = M2C_FIELD(unit, u32 *, 0);
    M2C_FIELD(unit, u8 *, 0x91) = 0;
    M2C_FIELD(unit, s32 *, 0x84) = -1;
    M2C_FIELD(unit, s32 *, 0x80) = -1;
    M2C_FIELD(unit, s32 *, 0x88) = 0;
    M2C_FIELD(unit, u8 *, 0x92) = 0;
    M2C_FIELD(unit, u32 *, 0) = flags & ~2;
    M2C_FIELD(unit, f32 *, 0x28) = x0;
    M2C_FIELD(unit, u32 *, 0x2c) = y0;
    M2C_FIELD(unit, f32 *, 0x30) = z0;
    M2C_FIELD(unit, s32 *, 0x58) = wake_grid_cell(x0, z0);
    M2C_FIELD(unit, f32 *, 0x34) = x1;
    M2C_FIELD(unit, u32 *, 0x38) = y1;
    M2C_FIELD(unit, f32 *, 0x3c) = z1;
    M2C_FIELD(unit, s32 *, 0x5c) = wake_grid_cell(x1, z1);
    M2C_FIELD(unit, f32 *, 0x40) = x2;
    M2C_FIELD(unit, u32 *, 0x44) = y2;
    M2C_FIELD(unit, f32 *, 0x48) = z2;
    M2C_FIELD(unit, s32 *, 0x60) = wake_grid_cell(x2, z2);
    M2C_FIELD(unit, u8 *, 0x20) = 3;
    M2C_FIELD(unit, s32 *, 0x24) = tag;
    M2C_FIELD(unit, u32 *, 0) &= ~4;
    M2C_FIELD(unit, u32 *, 0) &= ~0x200;
    M2C_FIELD(unit, u32 *, 0) |= 2;
    M2C_FIELD(unit, u32 *, 0) &= ~0x00800000;
    M2C_FIELD(unit, u8 *, 0x91) = 1;
    M2C_FIELD(unit, s32 *, 0x84) = -1;
}

static inline void wake_publish3_mode2(void *unit, f32 x0, u32 y0, f32 z0, f32 x1, u32 y1, f32 z1, f32 x2, u32 y2, f32 z2, s32 tag)
{
    u32 flags;
    func_001072B8(unit);
    flags = M2C_FIELD(unit, u32 *, 0);
    M2C_FIELD(unit, u8 *, 0x91) = 0;
    M2C_FIELD(unit, s32 *, 0x84) = -1;
    M2C_FIELD(unit, s32 *, 0x80) = -1;
    M2C_FIELD(unit, s32 *, 0x88) = 0;
    M2C_FIELD(unit, u8 *, 0x92) = 0;
    M2C_FIELD(unit, u32 *, 0) = flags & ~2;
    M2C_FIELD(unit, f32 *, 0x28) = x0;
    M2C_FIELD(unit, u32 *, 0x2c) = y0;
    M2C_FIELD(unit, f32 *, 0x30) = z0;
    M2C_FIELD(unit, s32 *, 0x58) = wake_grid_cell(x0, z0);
    M2C_FIELD(unit, f32 *, 0x34) = x1;
    M2C_FIELD(unit, u32 *, 0x38) = y1;
    M2C_FIELD(unit, f32 *, 0x3c) = z1;
    M2C_FIELD(unit, s32 *, 0x5c) = wake_grid_cell(x1, z1);
    M2C_FIELD(unit, f32 *, 0x40) = x2;
    M2C_FIELD(unit, u32 *, 0x44) = y2;
    M2C_FIELD(unit, f32 *, 0x48) = z2;
    M2C_FIELD(unit, s32 *, 0x60) = wake_grid_cell(x2, z2);
    M2C_FIELD(unit, u8 *, 0x20) = 3;
    M2C_FIELD(unit, s32 *, 0x24) = tag;
    M2C_FIELD(unit, u32 *, 0) &= ~4;
    M2C_FIELD(unit, u32 *, 0) &= ~0x200;
    M2C_FIELD(unit, u32 *, 0) |= 2;
    M2C_FIELD(unit, u32 *, 0) &= ~0x00800000;
    M2C_FIELD(unit, u8 *, 0x91) = 2;
    M2C_FIELD(unit, s32 *, 0x84) = -1;
    M2C_FIELD(unit, s32 *, 0x88) = 90;
}


typedef struct WakePoint { f32 x, y, z; } WakePoint;
typedef struct WakeOwnerView {
    u8 bytes_00[0x20];
    u8 count;
    u8 bytes_21[7];
    WakePoint points[3];
    f32 backup_x, backup_y, backup_z;
    s32 cells[3];
    s32 backup_cell;
} WakeOwnerView;

void func_00121F38(void *arg0, void *arg1) {
    f32 points[9];
    void *height_point;
    f32 *temp_a1;
    f32 *temp_v1_2;
    f32 temp_f2;
    f32 temp_f2_10;
    f32 temp_f2_11;
    f32 temp_f2_12;
    f32 temp_f2_13;
    f32 temp_f2_14;
    f32 temp_f2_15;
    f32 temp_f2_16;
    f32 temp_f2_17;
    f32 temp_f2_18;
    f32 temp_f2_19;
    f32 temp_f2_20;
    f32 temp_f2_21;
    f32 temp_f2_22;
    f32 temp_f2_23;
    f32 temp_f2_24;
    f32 temp_f2_25;
    f32 temp_f2_26;
    f32 temp_f2_27;
    f32 temp_f2_28;
    f32 temp_f2_29;
    f32 temp_f2_2;
    f32 temp_f2_30;
    f32 temp_f2_31;
    f32 temp_f2_32;
    f32 temp_f2_33;
    f32 temp_f2_34;
    f32 temp_f2_35;
    f32 temp_f2_36;
    f32 temp_f2_3;
    f32 temp_f2_4;
    f32 temp_f2_5;
    f32 temp_f2_6;
    f32 temp_f2_7;
    f32 temp_f2_8;
    f32 temp_f2_9;
    f32 temp_f4;
    f32 temp_f4_2;
    f32 temp_f4_3;
    f32 temp_f4_4;
    f32 temp_f4_5;
    f32 temp_f4_6;
    f32 temp_f4_7;
    f32 temp_f6;
    f32 temp_f6_2;
    f32 temp_f6_3;
    f32 temp_f8;
    f32 var_f0;
    f32 var_f0_2;
    f32 var_f0_3;
    f32 var_f20;
    f32 var_f22;
    f32 var_f24;
    f32 var_f26;
    s32 temp_v0_3;
    s32 var_s0;
    u8 temp_a0;
    u8 temp_a0_2;
    u8 temp_a0_4;
    u8 temp_v0;
    u8 temp_v0_2;
    u8 temp_v1;
    u8 temp_v1_5;
    void *temp_a0_3;
    void *temp_a0_5;
    void *temp_a1_2;
    void *temp_v1_3;
    void *temp_v1_4;

    temp_v1 = M2C_FIELD(arg1, u8 *, 1);
    switch (temp_v1) {                              /* switch 1; irregular */
    case 0:                                         /* switch 1 */
        M2C_FIELD(arg0, u8 *, 0x91) = (u8) M2C_FIELD(arg1, u8 *, 2);
        temp_v0 = M2C_FIELD(arg1, u8 *, 3);
        M2C_FIELD(arg0, u8 *, 0x92) = temp_v0;
        if ((temp_v0 & 0xFF) == 2) {
            M2C_FIELD(arg0, u8 *, 0x92) = 0U;
            M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) | 0x800000);
            return;
        }
        return;
    case 1:                                         /* switch 1 */
        temp_a0 = M2C_FIELD(arg1, u8 *, 4);
        var_s0 = 0;
        if (temp_a0 != 0) {
            var_s0 = 1;
            if (M2C_FIELD(arg1, u8 *, 5) != 0) {
                temp_f8 = D_801F0D98.field_00 + (((D_801F0D98.field_08 - D_801F0D98.field_00) * (f32)temp_a0) / 256.0f);
                points[0] = temp_f8;
                temp_f4_3 = D_801F0D98.field_04 + (((D_801F0D98.field_0C - D_801F0D98.field_04) * (f32)M2C_FIELD(arg1, u8 *, 5)) / 256.0f);
                points[2] = temp_f4_3;
                height_point = &points[0];
                if (M2C_FIELD(arg0, s32 *, 0x70) == 1) {
                    M2C_FIELD(height_point, f32 *, 4) = func_000F3428(D_800E7AB9, temp_f8, temp_f4_3);
                } else {
                    M2C_FIELD(height_point, f32 *, 4) = func_000F315C(D_800E7AB9, temp_f8, temp_f4_3);
                }
            } else {
                func_0012EA80(temp_a0 - 1, &points[0]);
            }
            temp_v1_2 = &points[(var_s0 - 1) * 3];
            if (M2C_FIELD(arg0, f32 *, 8) == M2C_FIELD(temp_v1_2, f32 *, 0)) {
                if (M2C_FIELD(arg0, f32 *, 0x10) == M2C_FIELD(temp_v1_2, f32 *, 8)) {
                    temp_f6 = M2C_FIELD(temp_v1_2, f32 *, 8);
                    if (((f64) temp_f6 + D_801EE610) < (f64) D_801F0D98.field_0C) {
                        var_f0 = 0.0001f;
                        var_f0 = temp_f6 + var_f0;
                    } else {
                        var_f0 = 0.0001f;
                        var_f0 = temp_f6 - var_f0;
                    }
                    M2C_FIELD(temp_v1_2, f32 *, 8) = var_f0;
                }
            }
            temp_a0_2 = M2C_FIELD(arg1, u8 *, 6);
            if (temp_a0_2 != 0) {
                var_s0++;
                if (M2C_FIELD(arg1, u8 *, 7) != 0) {
                    temp_v1_3 = &points[(var_s0 - 1) * 3];
                    M2C_FIELD(temp_v1_3, f32 *, 0) = D_801F0D98.field_00 + (((D_801F0D98.field_08 - D_801F0D98.field_00) * (f32)temp_a0_2) / 256.0f);
                    M2C_FIELD(temp_v1_3, f32 *, 8) = D_801F0D98.field_04 + (((D_801F0D98.field_0C - D_801F0D98.field_04) * (f32)M2C_FIELD(arg1, u8 *, 7)) / 256.0f);
                    height_point = temp_v1_3;
                    if (M2C_FIELD(arg0, s32 *, 0x70) == 1) {
                        M2C_FIELD(height_point, f32 *, 4) = func_000F3428(D_800E7AB9, points[3], points[5]);
                    } else {
                        M2C_FIELD(height_point, f32 *, 4) = func_000F315C(D_800E7AB9, points[3], points[5]);
                    }
                } else {
                    func_0012EA80(temp_a0_2 - 1, &points[3]);
                }
                if (var_s0 == 1) {
                    if ((M2C_FIELD(arg0, f32 *, 8) == points[0]) && (M2C_FIELD(arg0, f32 *, 0x10) == points[2])) {
                        if (((f64) points[2] + D_801EE618) < (f64) D_801F0D98.field_0C) {
                            points[2] += 0.0001f;
                        } else {
                            points[2] -= 0.0001f;
                        }
                    }
                } else {
                    temp_a1 = &points[(var_s0 - 2) * 3];
                    temp_a0_3 = &points[(var_s0 - 1) * 3];
                    if (M2C_FIELD(temp_a1, f32 *, 0) == M2C_FIELD(temp_a0_3, f32 *, 0)) {
                        if (M2C_FIELD(temp_a1, f32 *, 8) == M2C_FIELD(temp_a0_3, f32 *, 8)) {
                            temp_f6_2 = M2C_FIELD(temp_a0_3, f32 *, 8);
                            if (((f64) temp_f6_2 + D_801EE620) < (f64) D_801F0D98.field_0C) {
                                var_f0_2 = 0.0001f;
                        var_f0_2 = temp_f6_2 + var_f0_2;
                            } else {
                                var_f0_2 = 0.0001f;
                        var_f0_2 = temp_f6_2 - var_f0_2;
                            }
                            M2C_FIELD(temp_a0_3, f32 *, 8) = var_f0_2;
                        }
                    }
                }
                temp_a0_4 = M2C_FIELD(arg1, u8 *, 8);
                if (temp_a0_4 != 0) {
                    var_s0++;
                    if (M2C_FIELD(arg1, u8 *, 9) != 0) {
                        temp_v1_4 = &points[(var_s0 - 1) * 3];
                        M2C_FIELD(temp_v1_4, f32 *, 0) = D_801F0D98.field_00 + (((D_801F0D98.field_08 - D_801F0D98.field_00) * (f32)temp_a0_4) / 256.0f);
                        M2C_FIELD(temp_v1_4, f32 *, 8) = D_801F0D98.field_04 + (((D_801F0D98.field_0C - D_801F0D98.field_04) * (f32)M2C_FIELD(arg1, u8 *, 9)) / 256.0f);
                        height_point = temp_v1_4;
                    if (M2C_FIELD(arg0, s32 *, 0x70) == 1) {
                            M2C_FIELD(height_point, f32 *, 4) = func_000F3428(D_800E7AB9, points[6], points[8]);
                        } else {
                            M2C_FIELD(height_point, f32 *, 4) = func_000F315C(D_800E7AB9, points[6], points[8]);
                        }
                    } else {
                        func_0012EA80(temp_a0_4 - 1, &points[6]);
                    }
                    if (var_s0 == 1) {
                        if ((M2C_FIELD(arg0, f32 *, 8) == points[0]) && (M2C_FIELD(arg0, f32 *, 0x10) == points[2])) {
                            if (((f64) points[2] + D_801EE628) < (f64) D_801F0D98.field_0C) {
                                points[2] += 0.0001f;
                            } else {
                                points[2] -= 0.0001f;
                            }
                        }
                    } else {
                        temp_a1_2 = &points[(var_s0 - 2) * 3];
                        temp_a0_5 = &points[(var_s0 - 1) * 3];
                        if (M2C_FIELD(temp_a1_2, f32 *, 0) == M2C_FIELD(temp_a0_5, f32 *, 0)) {
                            if (M2C_FIELD(temp_a1_2, f32 *, 8) == M2C_FIELD(temp_a0_5, f32 *, 8)) {
                                temp_f6_3 = M2C_FIELD(temp_a0_5, f32 *, 8);
                                if (((f64) temp_f6_3 + D_801EE630) < (f64) D_801F0D98.field_0C) {
                                    var_f0_3 = 0.0001f;
                        var_f0_3 = temp_f6_3 + var_f0_3;
                                } else {
                                    var_f0_3 = 0.0001f;
                        var_f0_3 = temp_f6_3 - var_f0_3;
                                }
                                M2C_FIELD(temp_a0_5, f32 *, 8) = var_f0_3;
                            }
                        }
                    }
                }
            }
        }
        temp_v1_5 = M2C_FIELD(arg1, u8 *, 2);
        switch (temp_v1_5) {
        case 0:
            switch (var_s0) {
            case 1:
                wake_publish1_mode0(arg0, points[0], points[1], points[2], 1);
                break;
            case 2:
                wake_publish2_mode0(arg0, points[0], points[1], points[2], points[3], points[4], points[5], 1);
                break;
            case 3:
                wake_publish3_mode0(arg0, points[0], M2C_FIELD(&points[1], u32 *, 0), points[2], points[3], M2C_FIELD(&points[4], u32 *, 0), points[5], points[6], M2C_FIELD(&points[7], u32 *, 0), points[8], 1);
                break;
            default:
                M2C_FIELD(arg0, u8 *, 0x91) = 0;
                break;
            }
            goto publication_done;
        case 1:
            switch (var_s0) {
            case 1:
                wake_publish1_mode1(arg0, points[0], points[1], points[2], 1);
                break;
            case 2:
                wake_publish2_mode1(arg0, points[0], points[1], points[2], points[3], points[4], points[5], 1);
                break;
            case 3:
                wake_publish3_mode1(arg0, points[0], M2C_FIELD(&points[1], u32 *, 0), points[2], points[3], M2C_FIELD(&points[4], u32 *, 0), points[5], points[6], M2C_FIELD(&points[7], u32 *, 0), points[8], 1);
                break;
            default:
                M2C_FIELD(arg0, u8 *, 0x91) = 0;
                break;
            }
            goto publication_done;
        case 2:
            switch (var_s0) {
            case 1:
                wake_publish1_mode2(arg0, points[0], points[1], points[2], 1);
                break;
            case 2:
                wake_publish2_mode2(arg0, points[0], points[1], points[2], points[3], points[4], points[5], 1);
                break;
            case 3:
                wake_publish3_mode2(arg0, points[0], M2C_FIELD(&points[1], u32 *, 0), points[2], points[3], M2C_FIELD(&points[4], u32 *, 0), points[5], points[6], M2C_FIELD(&points[7], u32 *, 0), points[8], 1);
                break;
            default:
                M2C_FIELD(arg0, u8 *, 0x91) = 0;
                break;
            }
            goto publication_done;
        publication_done:
            temp_v0_2 = M2C_FIELD(arg1, u8 *, 3);
            M2C_FIELD(arg0, u8 *, 0x92) = temp_v0_2;
            if ((temp_v0_2 & 0xFF) == 2) {
                M2C_FIELD(arg0, u8 *, 0x92) = 0;
                M2C_FIELD(arg0, u32 *, 0) |= 0x800000;
            }
            break;
        }
        if (M2C_FIELD(arg0, s32 *, 0) & 0x800000) {
            ((WakeOwnerView *)arg0)->backup_x = ((WakeOwnerView *)arg0)->points[((WakeOwnerView *)arg0)->count - 1].x;
            ((WakeOwnerView *)arg0)->backup_y = ((WakeOwnerView *)arg0)->points[((WakeOwnerView *)arg0)->count - 1].y;
            ((WakeOwnerView *)arg0)->backup_z = ((WakeOwnerView *)arg0)->points[((WakeOwnerView *)arg0)->count - 1].z;
            ((WakeOwnerView *)arg0)->backup_cell = ((WakeOwnerView *)arg0)->cells[((WakeOwnerView *)arg0)->count - 1];
            return;
        }
        break;
    case 2:                                         /* switch 1 */
        M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) & ~1);
        temp_v0_3 = M2C_FIELD(arg0, u8 *, 4) * 0x19;
        D_801971F1[temp_v0_3] = (s8) (D_801971F1[temp_v0_3] & 0xFB);
        break;
    }
}
