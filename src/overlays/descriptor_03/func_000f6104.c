typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
typedef struct {
    u8 unk000[0x104];
    s32 w104;
    u8 unk108[4];
    f32 f10C;
    u8 unk110[0xC];
    void *sky;
    u8 unk120[0x2E];
    u8 r;
    u8 g;
    u8 b;
    u8 unk151[0xB];
    f32 f15C;
} Scene0E;
extern Gfx *gTitleCardDisplayListCursor;
extern Scene0E *D_801ABA58;
void func_000f6104(void)
{
  Gfx *new_var;
  Gfx *g;
  g = gTitleCardDisplayListCursor++;
  g->w0 = 0xE7000000;
  g->w1 = 0;
  g = gTitleCardDisplayListCursor++;
  g->w0 = 0xFA000000;
  new_var = g;
  new_var->w1 = (u8) ((u32) (D_801ABA58->f15C * 255.0f));
}
