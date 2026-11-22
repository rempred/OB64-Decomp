#include "common/os_message_queue.h"

extern MessageQueue g_boot_resource_lzss_table;
extern const unsigned char g_boot_resource_lzss_error_anchor[];
extern unsigned char g_resource_callback_storage[];
extern Thread g_resource_callback_context;
extern void func_0000B030(void *unused);

void boot_resource_loader_callback_register(unsigned int arg0, unsigned int arg1)
{
    Thread *context;

    /* The existing 800B0000 anchor addresses storage at -0xD00. The separate
     * view keeps its address from living across the initialization call. */
    func_00023970(&g_boot_resource_lzss_table,
                 (void **)(g_boot_resource_lzss_error_anchor - 0xD00), 8);
    context = &g_resource_callback_context;
    func_00024C60(context, arg0, func_0000B030, 0, g_resource_callback_storage, arg1);
    func_00024E20(context);
}
