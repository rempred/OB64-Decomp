#include "common/types.h"
#include "game/indexed_record_lookup.h"

typedef struct {
    s8 *text;
    u8 remaining[8];
} IndexedTextRecord;

s8 *func_000453e0(s32 selector)
{
    const IndexedTextRecord *records = (const IndexedTextRecord *)0x8018E6CCU;

    return records[(u16)selector].text;
}
