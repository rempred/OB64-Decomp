typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_801CE8BC;
s32 D_801C8C90(u8 *actor_bytes);
s32 func_002A8E44(u8 *body, u8 *other_body)
{
  u8 *actor_bytes;
  s32 result;
  if (body == ((void *) 0))
  {
    return 0;
  }
  if (body[0x147] == 0xFF)
  {
    return 0;
  }
  if (body[0x147] != other_body[0x147])
  {
    return 0;
  }
  actor_bytes = (D_801CE8BC + 0x1C4) + (body[0x147] * 0xF8);
  if ((*((s32 *) (((u8 *) actor_bytes) + 0x48))) == 0)
  {
    return 0;
  }
  result = D_801C8C90(actor_bytes);
  if (result == 1)
  {
    if (body[0x149] != result)
    {
      return 1;
    }
    return result = 2;
  }
  return 0;
}
