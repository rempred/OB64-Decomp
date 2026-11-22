#include "common/os_message_queue.h"

/* Observed request prefix; later fields are outside this helper's view. */
typedef struct ResourceReadyRequest {
    unsigned int field_00;
    void *field_04;
    unsigned char field_08;
} ResourceReadyRequest;

extern MessageQueue g_boot_resource_lzss_table;

void boot_resource_record_mark_ready(ResourceReadyRequest *request)
{
    request->field_08 = 1;
    func_00023C10(&g_boot_resource_lzss_table, request, 1);
}
