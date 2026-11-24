typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    s32 id;
    s32 chunk;
    s32 *p08;
    s32 kind;
    u32 n;
    void *p14;
    u8 unk18[4];
    void **list;
    u32 *age;
    u8 *p24;
    u8 *w28;
    u8 *w2C;
    u8 *w30;
    u8 *p34;
    void *p38;
} Rec2A;
extern Rec2A *D_802395B0;
Rec2A *func_002A2458(s32 id, s32 kind);
Rec2A *func_002A2458(s32 id, s32 kind);
u8 *func_002A2674(s32 id, s32 kind)
{
  Rec2A *r = D_802395B0;
  s32 i;
  for (i = 40; (i--) != 0; r++)
  {
    if ((r->id == id) && (r->kind == kind))
    {
      return r->w28;
    }
  }
  r = func_002A2458(id, kind);
  return r->w28;
}
