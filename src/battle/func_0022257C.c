#include "game/combat_selector.h"
#include "game/combat_evaluator.h"

typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;

typedef struct {
    u32 words[20];
} LocalCopy;


s32 func_0022257C(void *record, s32 selector, s32 *out)
{
    union {
        LocalCopy copy;
        Func001F0E64Record record;
        Func001F197CState evaluator;
    } local;

    /* The five retail copy iterations each transfer four words: retain the
     * complete 0x50-byte envelope, including its final pointer word. */
    local.copy = *(LocalCopy *)record;
    func_001F0E64(&local.record, selector);
    return func_001F197C(
        *(void **)(*(u8 **)((u8 *)record + 0x4C) + 0x40), &local.evaluator, out);
}
