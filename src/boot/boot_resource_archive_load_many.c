#include "game/boot_archive_record.h"

extern void func_0000B33C(u32 acquire);
extern void func_0000C204(void); /* RAM8007C204, not symbol-text arithmetic. */
extern void func_0000BBC0(u32 key); /* RAM8007BBC0. */
extern s32 func_0000F47C(const u8 *name, const u8 *record_name);
extern void func_0000BC8C(ArcFile *context, u8 *record);
extern void func_0000BF90(const u8 *name, const u8 *message);
extern const u8 g_boot_resource_lzss_error_anchor[];
extern ArcFileExtent g_resource_archive_result; /* Views the write slot buffer and size words at 0x800AF360 and 0x800AF364. */

void boot_resource_archive_load_many(ResourceArchiveInput *input,
                                    ResourceArchiveRequest *requests, s32 count)
{
    ResourceRecordScratch scratch;
    ArcFile *handle;
    ArcFileExtent *result;
    u32 position;
    s32 index;
    s32 record_index;
    s32 total;

    func_0000B33C(1);
    index = 0;
    func_0000C204();
    total = count;
    for (; index < total; index++) {
        *(u8 *volatile *)&requests[index].buffer = 0;
        requests[index].size = 0;
    }

    handle = func_0000F4E4((void *)input->field_00,
                           g_boot_resource_lzss_error_anchor - 0x1F58,
                           input->buffer, (s32)input->size);
    if (handle == 0) {
        func_0000BBC0(input->field_00);
    }
    /* This order schedules index initialization into the retail null-test delay slot. */
    record_index = 0;
    result = &g_resource_archive_result;

    while (func_0000B3E4(handle, &scratch.record) != 0) {
        position = handle->pos;
        for (index = 0; index < total; index++) {
            if (requests[index].name == 0
                    ? *(volatile s32 *)&requests[index].record_index == record_index
                    : func_0000F47C(requests[index].name, scratch.record.bytes16) == 0) {
                if (scratch.record.word0C != 0) {
                    u32 second_result;
                    func_0000BC8C(handle, (u8 *)&scratch.record);
                    /* The result and index stores keep their observed order here. */
                    *(u8 *volatile *)&requests[index].buffer = result->buf;
                    /* Preserve the second result read before the index store. */
                    second_result = ((volatile ArcFileExtent *)result)->size;
                    *(volatile s32 *)&requests[index].record_index = record_index;
                    requests[index].size = second_result;
                }
                break;
            }
        }
        if (index < total && --count == 0) {
            break;
        }
        record_index++;
        handle->pos = position + scratch.record.word08;
    }
    /* The assignment result is the release argument; KMC schedules the real
     * close store into the two exit delay slots in this expression form. */
    func_0000B33C(handle->open = 0);

    index = 0;
    count = 0;
    for (; index < total; index++) {
        if (*(u8 *volatile *)&requests[index].buffer == 0) {
            count++;
            func_0000BF90(requests[index].name, g_boot_resource_lzss_error_anchor - 0x1F54);
        }
    }
    if (count != 0) {
        func_0000BFF4((const u8 *)input->field_00, g_boot_resource_lzss_error_anchor - 0x1F38);
    }
}
