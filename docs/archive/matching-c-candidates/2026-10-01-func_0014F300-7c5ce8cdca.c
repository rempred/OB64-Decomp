typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;

extern u8 D_801971F2[][25];
extern u8 D_80193BD1[];
extern u8 D_80195571[];
extern u8 func_00043100(int primary_class, int alternate_class);

u16 func_0014F300(u8 source_index)
{
    u32 total = 0;
    s32 first_class_table = source_index < 30;
    u8 *cursor = D_801971F2[source_index];
    u8 *end = cursor + 5;

    do {
        u32 member = *cursor;
        s32 below_limit = member < 100;
        if ((member != 0) & below_limit) {
            u8 primary_class;
            u8 alternate_class;
            if (first_class_table) {
                primary_class = D_80193BD1[member * 56];
                alternate_class = D_80193BD1[member * 56 + 1];
            } else {
                primary_class = D_80195571[member * 52];
                alternate_class = D_80195571[member * 52 + 1];
            }
            ++cursor;
            total += func_00043100(primary_class, alternate_class);
        } else {
            if (!below_limit)
                ++total;
            ++cursor;
        }
    } while ((s32)cursor < (s32)end);
    return total;
}
