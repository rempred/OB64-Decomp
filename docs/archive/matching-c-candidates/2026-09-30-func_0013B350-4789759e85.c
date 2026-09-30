typedef unsigned char u8;
typedef int s32;
extern s32 func_0005c110(s32);

/* Research reconstruction of the complete accepted owner. The numeric
 * inputs, flag IDs, and two output bytes intentionally have no terrain names.
 * Ordered flag queries and default paths are retained; no table owner is
 * activated by this source. Static mapping is separate from matching proof.
 */
void func_0013B350(s32 input0, s32 input1, u8 *first, u8 *second) {
    u8 result0 = 0;
    u8 result1 = 0;
    s32 query;

    if ((u8)input0 == 0) {
        input0 = 9;
    }
    switch ((u8)input0) {
    case 1:
    case 2:
    case 4:
        goto inputs_0;
    case 3:
    case 5:
        goto inputs_1;
    case 6:
    case 7:
    case 12:
        goto inputs_2;
    case 8:
    case 9:
        goto inputs_3;
    case 10:
    case 11:
        goto inputs_4;
    default:
        goto both_zero;
    }

inputs_0:
    switch ((u8)input1) {
    case 1:
    case 2:
    case 4:
        goto both_one;
    case 3:
    case 5:
        goto second3_5_flags11_12;
    case 6:
    case 7:
        goto first2_4_flags11_12;
    case 8:
    case 9:
        goto flag13_then_11_12;
    default:
        goto both_zero;
    }

inputs_1:
    switch ((u8)input1) {
    case 1:
    case 2:
    case 4:
        goto first3_5_flags11_12;
    case 3:
    case 5:
    case 6:
    case 7:
        goto both_one;
    case 8:
    case 9:
        goto second8_flag13;
    default:
        goto both_zero;
    }

inputs_2:
    switch ((u8)input1) {
    case 1:
    case 2:
    case 4:
        goto flags11_12_second;
    case 3:
    case 5:
    case 6:
    case 7:
        goto both_one;
    case 8:
    case 9:
        goto first7_12_flag13;
    default:
        goto both_zero;
    }

inputs_3:
    switch ((u8)input1) {
    case 1:
    case 2:
    case 4:
        goto flag13_then_11_12;
    case 3:
    case 5:
    case 6:
    case 7:
        goto first8_flag13;
    case 8:
    case 9:
        goto both_one;
    default:
        goto both_zero;
    }

inputs_4:
    switch ((u8)input1) {
    case 1:
    case 2:
    case 4:
        goto both_one;
    case 3:
    case 5:
        goto second3_5_flags11_12;
    case 6:
    case 7:
        goto first10_11_flags11_12;
    case 8:
    case 9:
        goto flag13_then_11_12;
    default:
        goto both_zero;
    }

second3_5_flags11_12:
    if ((u8)input1 == 3 && func_0005c110(11) != 0) goto both_one;
    if ((u8)input1 == 5 && func_0005c110(12) != 0) goto both_one;
    goto flags11_12_second;
first2_4_flags11_12:
    if ((u8)input0 == 2 && func_0005c110(11) != 0) goto both_one;
    if ((u8)input0 == 4 && func_0005c110(12) != 0) goto both_one;
    goto flags11_12_second;
first10_11_flags11_12:
    if ((u8)input0 == 10 && func_0005c110(11) != 0) goto both_one;
    if ((u8)input0 == 11 && func_0005c110(12) != 0) goto both_one;
    goto flags11_12_second;
first3_5_flags11_12:
    if ((u8)input0 == 3 && func_0005c110(11) != 0) goto both_one;
    if ((u8)input0 == 5 && func_0005c110(12) != 0) goto both_one;
    goto flags11_12_second;
flag13_then_11_12:
    if (func_0005c110(13) == 0) goto both_zero;
    goto flags11_12_second;
second8_flag13:
    if ((u8)input1 == 8 && func_0005c110(13) != 0) goto both_one;
    query = 13;
    goto last_query;
first7_12_flag13:
    if (((u8)input0 == 7) | ((u8)input0 == 12)) {
        if (func_0005c110(13) != 0) goto both_one;
    }
    query = 13;
    goto last_query;
first8_flag13:
    if ((u8)input0 == 8 && func_0005c110(13) != 0) goto both_one;
    query = 13;
    goto last_query;
flags11_12_second:
    if (func_0005c110(11) != 0) goto second_one;
    query = 12;
last_query:
    result0 = 0;
    result1 = func_0005c110(query) != 0;
    goto publish;
second_one:
    result0 = 0;
    result1 = 1;
    goto publish;
both_one:
    result0 = 1;
    result1 = 1;
    goto publish;
both_zero:
    result0 = 0;
    result1 = 0;
publish:
    *first = result0;
    *second = result1;
}
