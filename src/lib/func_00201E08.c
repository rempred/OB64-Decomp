typedef signed int s32;

typedef unsigned int u32;

extern u32 func_00201E38(s32 arg0, u32 arg1);

s32 func_00201E08(s32 arg0, s32 arg1, s32 arg2)
{
    return (s32)func_00201E38(arg0, (u32)arg1) * arg2;
}
