#include "common/types.h"

struct Func00269F00Input;
struct Func00269F00Output;

typedef struct Func0026A078Pair {
    u16 index_00;
    u16 level_02;
} Func0026A078Pair;

typedef struct Func0026A078Input {
    u32 unknown_00;
    u32 count_04;
    u8 unknown_08[8];
    Func0026A078Pair *value_10;
} Func0026A078Input;

typedef struct Func0026A078Row {
    float value_00[3];
    u32 unknown_0C;
} Func0026A078Row;

typedef struct Func0026A078Record {
    Func0026A078Row row_00[3];
    u8 unknown_30[0x14];
} Func0026A078Record;

extern void func_00269F00(s32 argument, struct Func00269F00Input *input,
                         struct Func00269F00Output *output);
extern void func_0025F080(void *value, void *matrix, void *result);
extern float D_80220FF0[16];

void func_0026a078(s32 argument, Func0026A078Input *input,
                   Func0026A078Record *output)
{
    float matrix[4][4];
    float initial_values[3];
    /* Current hypothesis for the table span before saved registers, not a
     * proven semantic maximum level. Its observed base is sp+0x60. */
    float *value_stack[36];
    s32 stack_index;
    s32 current_level;
    u32 item;
    u32 component;
    u32 output_item;
    s32 row;
    s32 column;

    /* The callee's opaque views cover the same first three floats per record. */
    func_00269F00(argument, (struct Func00269F00Input *)input,
                 (struct Func00269F00Output *)output);
    initial_values[0] = initial_values[1] = initial_values[2] = 1.0f;
    value_stack[0] = initial_values;
    current_level = -1;
    stack_index = 0;

    for (item = 0; item < input->count_04; item++) {
        Func0026A078Pair *entry = &input->value_10[item];
        float *selected = output[entry->index_00].row_00[0].value_00;
        s32 level = entry->level_02;

        for (;;) {
            if (current_level < level) {
                current_level++;
                break;
            }
            stack_index--;
            if (current_level == level) {
                break;
            }
            current_level--;
        }
        for (component = 0; component < 3; component++) {
            selected[component] *= value_stack[stack_index][component];
        }
        value_stack[++stack_index] = selected;
    }

    for (output_item = 0; output_item < input->count_04; output_item++) {
        func_0025F080(output, D_80220FF0, matrix);
        for (row = 0; row < 3; row++) {
            for (column = 0; column < 3; column++) {
                output->row_00[row].value_00[column] = matrix[row][column];
            }
        }
        output++;
    }
}
