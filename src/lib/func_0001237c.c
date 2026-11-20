typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    s32 unk00;
    s32 count;
    u8 pad08[4];
    s32 flags;
    void *ptrbank;
    u32 unk14;
    struct {
        u32 ptr;
        u32 unk4;
    } entries[1];
} MusFxBank;
extern MusFxBank *D_800B1838;
void func_0001237c(MusFxBank *bank);
void func_0001237c(MusFxBank *bank)
{
  u32 base = (u32) bank;
  s32 i;
  u32 new_var;
  if (bank->flags & 1)
  {
    return;
  }
  if (D_800B1838 == ((void *) 0))
  {
    D_800B1838 = bank;
  }
  bank->flags = 1;
  new_var = bank->unk14;
  bank->ptrbank = (void *) 0;
  i = new_var;
  bank->unk14 = base + i;
  for (i = 0; i < bank->unk00; i++)
  {
    bank->entries[i].ptr = base + bank->entries[i].ptr;
  }
}
