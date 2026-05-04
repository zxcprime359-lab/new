import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faqs() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-medium text-muted-foreground">
        Frequently Asked Questions
      </h1>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is this website free to use?</AccordionTrigger>
          <AccordionContent>
            Yes, our website is completely free. You can browse and watch movies
            without any subscription.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Do I need to create an account?</AccordionTrigger>
          <AccordionContent>
            No, you can access all content without signing up. However, creating
            an account may unlock additional features in the future.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Why are some movies not available?
          </AccordionTrigger>
          <AccordionContent>
            Availability depends on external sources and licensing. Some movies
            may be removed or unavailable in certain regions.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Why is the video not loading?</AccordionTrigger>
          <AccordionContent>
            This could be due to slow internet, server issues, or the selected
            stream not working. Try switching servers or refreshing the page.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>Can I download movies?</AccordionTrigger>
          <AccordionContent>
            Download availability depends on the source. Some content may
            include download options, while others are streaming only.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>Are there ads on the website?</AccordionTrigger>
          <AccordionContent>
            Yes, ads help keep the website free. We try to keep them minimal and
            non-intrusive.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7">
          <AccordionTrigger>Is this website safe?</AccordionTrigger>
          <AccordionContent>
            We aim to provide a safe browsing experience. However, always avoid
            clicking suspicious ads and use an ad blocker if needed.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger>How often is content updated?</AccordionTrigger>
          <AccordionContent>
            New movies and TV shows are added regularly to keep the library up
            to date.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
