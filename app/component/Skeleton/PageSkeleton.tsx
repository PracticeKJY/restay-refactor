"use client";

import { useTranslations } from "next-intl";
import Skeleton from "./Skeleton";
import LoadingRegion from "./LoadingRegion";
import styles from "./PageSkeleton.module.css";
import PageShell, { PageHeader } from "../PageShell";
import Container from "../Container";
import home from "@/app/page.module.css";
import wishlist from "@/app/wishList/WishListCard.module.css";
import trips from "@/app/trips/Trips.module.css";
import detail from "@/app/listings/[id]/DetailListingPage.module.css";
import heading from "@/app/listings/[id]/DetailListingHeading.module.css";
import booking from "@/app/component/listings/ListingsReservation.module.css";
import gallery from "@/app/listings/[id]/DetailListingGallery.module.css";
import reservation from "@/app/reservation/[id]/Reservation.module.css";
import chat from "@/app/messages/Messages.module.css";

export function MediaSkeleton({ hero = false }: { hero?: boolean }) {
  return <div className={`${styles.media} ${hero ? styles.heroMedia : ""}`}><Skeleton variant="custom" height="100%" style={{ height: "100%" }} /></div>;
}

export function CardSkeletons({ homePage = false }: { homePage?: boolean }) {
  return <LoadingRegion><div className={homePage ? home.listingsContainer : wishlist.listingsContainer}>
    {Array.from({ length: homePage ? 8 : 6 }, (_, i) => <div className={styles.card} key={i}>
      <div className={`${styles.media} ${homePage ? styles.homeMedia : ""}`}><Skeleton variant="custom" height="100%" style={{ height: "100%" }} /></div>
      <div className={styles.copy}><Skeleton variant="text" lines={3} widths={["45%", "80%", "60%"]} height={homePage ? 16 : 20} /></div>
    </div>)}
  </div></LoadingRegion>;
}

export function CollectionSkeleton({ kind }: { kind: "wishlist" | "trips" }) {
  const t = useTranslations("WorkspaceDesign");
  const common = useTranslations("Common");
  const prefix = kind === "wishlist" ? "wishlist" : "trips";
  return <PageShell eyebrow={t(`${prefix}Eyebrow`)} title={t(`${prefix}Title`)} description={t(`${prefix}Description`)}>
    {kind === "trips" && <h2 className={trips.tripsTitle}>{common("confirmedReservations")}</h2>}
    <CardSkeletons />
  </PageShell>;
}

export function DetailSkeleton() {
  const t = useTranslations("Listings");
  return <Container><LoadingRegion><div className={detail.contentContainer}>
    <div className={detail.mainCarousel}>
      <div className={gallery.swiperWrapper}>
        <div className={gallery.mainFrame}><MediaSkeleton hero /></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} variant="image" height="100%" style={{ aspectRatio: "1.5" }} />)}
        </div>
      </div>
      <div className={heading.infoContainer}><Skeleton variant="text" widths={["85%", "65%"]} height={24} /><div className={heading.comment}><span className={heading.commentTitle}>{t("aNoteFromYourHost")}</span><div className={heading.commentBody}>{t("weHopeEveryoneWhoStaysHereEnjoys")}</div></div></div>
    </div>
    <div className={detail.bodyContainer}><div className={detail.hostDataContainer}><Skeleton variant="avatar" height={60} /><div className={styles.section}><Skeleton variant="text" lines={5} /></div></div><div className={booking.dataPickerContainer}><div className={booking.dataPickerWrapper}><Skeleton variant="text" lines={4} /><Skeleton variant="image" height={220} /></div></div></div>
    <div className={detail.mapInfoTitle}>{t("whereYouWillStay")}</div><Skeleton variant="image" height={400} />
  </div></LoadingRegion></Container>;
}

export function ReservationSkeleton() {
  const t = useTranslations("Reservation");
  return <Container><LoadingRegion><div className={reservation.reservationContainer}>
    <div className={reservation.reservationInfo}><div className={reservation.title}>{t("requestToBook")}</div>
      {Array.from({ length: 4 }, (_, i) => <div className={styles.section} key={i}><Skeleton variant="text" widths={["35%", "85%", "65%"]} height={22} /></div>)}
      <Skeleton variant="custom" height={48} />
    </div>
    <div className={`${reservation.productCardContainer} ${styles.reservationSummary}`}><div className={reservation.productCardWrapper}><div className={reservation.productInfoWrapper}><Skeleton variant="image" width={124} height={106} style={{ flexShrink: 0 }} /><Skeleton variant="text" width="100%" lines={3} /></div><div className={reservation.priceInfoHeading}>{t("priceDetails")}</div><Skeleton variant="text" lines={5} /></div></div>
  </div></LoadingRegion></Container>;
}

export function InboxSkeleton() {
  return <LoadingRegion>{Array.from({ length: 4 }, (_, i) => <div className={styles.row} key={i}><Skeleton variant="avatar" height={44} /><Skeleton variant="text" widths={["50%", "90%", "65%"]} height={14} /></div>)}</LoadingRegion>;
}

export function ThreadSkeleton() {
  return <LoadingRegion><div className={styles.bubbles}>{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} variant="image" height={64} radius={16} />)}</div></LoadingRegion>;
}

export function MessagesSkeleton({ room = false }: { room?: boolean }) {
  const t = useTranslations("Messages");
  const design = useTranslations("WorkspaceDesign");
  return <main className={chat.workspace} data-room={room}>
    <div className={chat.pageHeader}><PageHeader eyebrow={design("messagesEyebrow")} title={t("messages")} description={t("pageDescription")} /></div>
    <div className={chat.workspaceBody}>
      <aside className={`${chat.sidebar} ${room ? chat.hideOnMobile : ""}`}><div className={chat.sidebarHeader}><h2>{t("allMessages")}</h2></div><InboxSkeleton /></aside>
      <section className={`${chat.conversationArea} ${!room ? chat.hideOnMobile : ""}`}>
        {room ? <><div className={chat.chatHeader}><Skeleton variant="avatar" /><Skeleton variant="text" width="60%" lines={2} /></div><div className={chat.thread}><ThreadSkeleton /></div><div className={chat.composer}><Skeleton variant="image" height={72} radius={16} /></div></> : <div className={chat.emptyState}><h2>{t("selectConversation")}</h2><p>{t("selectDescription")}</p></div>}
      </section>
    </div>
  </main>;
}
