typedef signed int s32;

void battle_roster_write_back_members(void);
void func_00048294(void);
s32 func_0004813C(s32 arg0);
void func_000466f4(void);

s32 func_002224F4(void)
{
    s32 result;

    battle_roster_write_back_members();
    func_00048294();
    result = func_0004813C(0x10);
    func_000466f4();
    return result;
}
