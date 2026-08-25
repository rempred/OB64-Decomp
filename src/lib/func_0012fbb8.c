typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;

s32 func_00022e60(void);
extern u8 g_func_001957D0_source_records[];

asm(
    "# Hybrid compiler-placement constraint for func_0012FBB8.\n"
    "# The fixed $v0 register binding emits no MIPS instruction and does not implement division in assembly.\n"
    "# Signed division remains C; the binding leaves its quotient in $v0, and the next C assignment emits move $s0,$v0.\n"
    "# Without the binding KMC coalesces the quotient into $s0, omits that move, and changes the zero-count block layout.\n");

s32 func_0012FBB8(s32 arg0, s32 arg1)
{
    s32 temp_a1_106;
    s32 temp_a1_114;
    s32 temp_a2_109;
    s32 temp_a3_41;
    s32 temp_v1_107;
    s32 temp_v1_153;
    s32 temp_v1_75;
    s32 temp_v1_98;
    register s32 quotient asm ("$2");
    s32 var_a2_32;
    s32 var_s0_31;
    s32 var_v0_108;
    s32 var_v0_96;
    s32 var_v1_120;
    s32 is_player_unit;
    u8 *var_a1_40;
    u8 temp_a0_43;
    u16 temp_s1_17;
    u16 high_bit_adjustment;

    temp_s1_17 = *(u8 *)(0x801951CE + (arg1 * 0x24));
    if ((temp_s1_17 & 0xFFFF) == 0xFF) {
        goto reject;
    }
    if (arg0 < 0x1E) {
        goto accepted;
    }
reject:
    return 0;

accepted:
    high_bit_adjustment = (temp_s1_17 & 0x80) ? 0x28 : 0;
    temp_s1_17 &= 0x7F;
    var_s0_31 = 0;
    var_a2_32 = 0;
    is_player_unit = 1;
    var_a1_40 = g_func_001957D0_source_records + 2 + (arg0 * 0x19);
    temp_a3_41 = (s32)(var_a1_40 + 5);
loop:
    temp_a0_43 = *var_a1_40;
    if ((temp_a0_43 == 0) | (temp_a0_43 >= 0x63U)) {
        goto next;
    }
    if (is_player_unit == 0) {
        goto alternate_table;
    }
    var_s0_31 += *(u8 *)(0x80193BDB + (temp_a0_43 * 0x38));
    goto counted;
alternate_table:
    var_s0_31 += *(u8 *)(0x8019557B + (temp_a0_43 * 0x34));
counted:
    var_a2_32 += 1;
next:
    var_a1_40 += 1;
    temp_v1_75 = var_a2_32 & 0xFF;
    if ((s32)var_a1_40 < temp_a3_41) {
        goto loop;
    }
    if (temp_v1_75 != 0) {
        goto divide_average;
    }
    var_s0_31 = 0x32;
    goto average_ready;
divide_average:
    quotient = (s32)(var_s0_31 & 0xFFFF) / temp_v1_75;
    var_s0_31 = quotient;
average_ready:

    temp_v1_98 = func_00022e60();
    var_v0_96 = temp_v1_98 % 8;
    temp_a1_106 = var_s0_31 & 0xFFFF;
    temp_v1_107 = temp_s1_17 & 0xFFFF;
    var_v0_108 = temp_a1_106 - temp_v1_107;
    temp_a2_109 = high_bit_adjustment & 0xFFFF;
    if (var_v0_108 > 0) {
        goto absolute_ready;
    }
    var_v0_108 = temp_v1_107 - temp_a1_106;
absolute_ready:
    temp_a1_114 = var_v0_108 + var_v0_96 + temp_a2_109;
    var_v0_96 = temp_a1_114 & 0xFFFF;
    if ((u32)var_v0_96 >= 0x8D) {
        var_v1_120 = -5;
    } else if ((u32)var_v0_96 >= 0x6F) {
        var_v1_120 = -4;
    } else if ((u32)var_v0_96 >= 0x51) {
        var_v1_120 = -3;
    } else if ((u32)var_v0_96 >= 0x33) {
        var_v1_120 = -2;
    } else if ((u32)var_v0_96 >= 0x1F) {
        var_v1_120 = -1;
    } else if ((u32)var_v0_96 >= 0x10) {
        var_v1_120 = 0;
    } else {
        var_v1_120 = 2;
        if ((u32)var_v0_96 >= 6) {
            var_v1_120 = 1;
        }
    }
    temp_v1_153 = var_v1_120 + *(u8 *)0x801936A9;
    if (temp_v1_153 >= 0x65) {
        temp_v1_153 = 0x64;
    } else {
        temp_v1_153 &= (s32)~temp_v1_153 >> 31;
    }
    *(u8 *)0x801936A9 = temp_v1_153;
    return (u32)(temp_a1_114 & 0xFFFF) >= 0x1F;
}
