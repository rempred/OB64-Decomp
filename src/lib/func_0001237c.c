#include "common/mus_bank.h"
extern MusFxBank *D_800B1838;
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
