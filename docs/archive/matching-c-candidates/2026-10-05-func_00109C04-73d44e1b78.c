typedef unsigned int u32;
typedef int s32;

/* Partial view: only the observed first flag word is used here. */
typedef struct UnitFlags {
    u32 flags;
} UnitFlags;

/* Existing alias for pointer-bank entry30, not a new data owner. */
extern UnitFlags *D_801F0D28[];

void func_00109C04(void)
{
    s32 index = 30;
    UnitFlags **slot = D_801F0D28;

    do {
        (*slot)->flags &= ~0x800U;
        index++;
        slot++;
    } while (index < 50);
}
