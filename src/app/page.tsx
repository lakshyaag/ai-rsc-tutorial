"use client";
import { ChatList } from "@/components/chat-list";
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor";
import { Button } from "@/components/ui/button";
import { useEnterSubmit } from "@/lib/use-enter-submit";
import { ArrowDownIcon, PlusIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

export default function Home() {
	const form = useForm();
	const { formRef, onKeyDown } = useEnterSubmit();

	const onSubmit = (data: any) => {
		console.log({ data });
	};

	return (
		<main>
			<div className="pb-[200px] pt-4 md:pt-10">
				<ChatList messages={[]} />
				<ChatScrollAnchor />
			</div>

			<div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
				<div className="mx-auto sm:max-w-2xl sm:px-4">
					<div className="px-3 flex justify-center flex-col py-2 space-y-4 border-t shadow-lg bg-background sm:border md:py-4 bg-white">
						<form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
							<div className="relative flex flex-col w-full overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border">
								<TextareaAutosize
									tabIndex={0}
									onKeyDown={onKeyDown}
									placeholder="Type a message..."
									className="min-h-[60px] w-full resize-none bg-transparent pl-4 pr-16 py-[1.3rem]
              focus-within:outline-none sm:text-sm
              "
									autoFocus
									spellCheck={false}
									autoComplete="off"
									autoCorrect="off"
									rows={1}
									{...form.register("message")}
								/>
								<Button
									className="absolute right-0 top-4 sm:right-4"
									type="submit"
									size="icon"
									disabled={form.watch("message") === ""}
								>
									<ArrowDownIcon className="w-5 h-5" />
									<span className="sr-only">Send message</span>
								</Button>
							</div>
						</form>
						<Button
							variant="outline"
							size="lg"
							className="p-4 mt-4 rounded-full bg-background"
							onClick={(e) => {
								e.preventDefault();
								window.location.reload();
							}}
						>
							<PlusIcon className="w-5 h-5" />
							<span>New chat</span>
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
}
