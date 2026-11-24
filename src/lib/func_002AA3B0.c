typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;
extern u8 *D_8022A974;
extern u8 *D_801CE8BC;
s32 D_801C8C90(u8 *u);
typedef struct {
    f32 fovy;
    f32 unk04[4];
    f32 eye[3];
    f32 at[3];
} BattleCam2A8;
extern BattleCam2A8 D_8022A720;
extern inline s32 func_002A8E44(u8 *o, u8 *b)
{
  u8 *u;
  s32 r;
  if (o == ((void *) 0))
  {
    return 0;
  }
  if (o[0x147] == 0xFF)
  {
    return 0;
  }
  if (o[0x147] != b[0x147])
  {
    return 0;
  }
  u = (D_801CE8BC + 0x1C4) + (o[0x147] * 0xF8);
  if ((*((s32 *) (((u8 *) u) + 0x48))) == 0)
  {
    return 0;
  }
  r = D_801C8C90(u);
  if (r == 1)
  {
    if (o[0x149] != r)
    {
      return 1;
    }
    return r = 2;
  }
  return 0;
}
extern f32 D_801CE8EC;
extern f32 D_801CE8F0;
extern f32 D_801CE8F4;
extern inline u8 MountState2A8(u8 *o) {
    u8 *u;
    if (o == ((void *)0) || o[0x147] == 0xFF) {
        return 0;
    }
    u = D_801CE8BC + 0x1C4 + o[0x147] * 0xF8;
    if ((*(s32 *)((u8 *)(u) + (0x48))) == 0) {
        return 0;
    }
    if (D_801C8C90(u) == 1) {
        if (o[0x149] == 1) {
            return 2;
        }
        return 1;
    }
    return 0;
}
void func_00028F60(f32 mf[4][4], f32 x, f32 y, f32 z);
void func_00022e90(f32 mf[4][4], f32 r, f32 p, f32 h);
extern f32 D_801D06FC;
void func_002A9AD0(f32 rot[4][4], f32 scale[4][4], u8 *o);
void func_002AA3B0(void) {
    f32 rot[4][4];
    f32 scale[4][4];
    s16 i;
    s16 j;
    u8 *o;
    u8 *b;
    func_002AA1EC((u8 *)&D_8022A720);
    func_00022e90(rot, D_801CE8EC, D_801CE8F0, D_801CE8F4);
    func_00028F60(scale, D_801D06FC, D_801D06FC, D_801D06FC);
    for (i = 0; i < 28; i++) {
        o = (*(u8 * *)((u8 *)(D_8022A974 + (i) * 4) + (0x18)));
        if (o == ((void *)0)) {
            continue;
        }
        if (MountState2A8(o) == 2) {
            for (j = 0; j < 28; j++) {
                b = (*(u8 * *)((u8 *)(D_8022A974 + (j) * 4) + (0x18)));
                if (func_002A8E44(b, o) == 1) {
                    break;
                }
            }
            if (j < 28) {
                if ((*(s16 *)((u8 *)(o) + (0x13A))) == 1) {
                    (*(f32 *)((u8 *)(o) + (0x11C))) = (*(f32 *)((u8 *)(b) + (0x11C))) + 8.0f;
                    (*(f32 *)((u8 *)(o) + (0x124))) = (*(f32 *)((u8 *)(b) + (0x124))) - 8.0f;
                } else {
                    (*(f32 *)((u8 *)(o) + (0x11C))) = (*(f32 *)((u8 *)(b) + (0x11C))) - 8.0f;
                    (*(f32 *)((u8 *)(o) + (0x124))) = (*(f32 *)((u8 *)(b) + (0x124))) + 8.0f;
                }
                (*(f32 *)((u8 *)(o) + (0x120))) = (*(f32 *)((u8 *)(b) + (0x120)));
            }
        }
        func_002A9AD0(rot, scale, o);
    }
}
